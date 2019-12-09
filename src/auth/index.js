const { Router } = require('express');
const bcrypt = require('bcryptjs');

const User = require('../user/model');
const { superAdmin } = require('./superAdmin');
const { toJWT } = require('./jwt');
const { getEmailCredentials } = require('../sendEmail/middleware');
const { checkEmail, checkString } = require('../checkData');
const { sendRegisterEmail, alreadyRegisteredEmail, ResetPassword } = require('../sendEmail');
const randomCode = require('../randomCode');
const validate = require('./validate');

const router = new Router();

router.get('/validation', validate, async (req, res) => {
  try {
    if (!req.user.password) {
      return res.send({
        validationType: 'register',
        user: {
          id: req.user.id,
          email: req.user.email,
          rank: req.user.rank
        }
      });
    }
    if (!req.user.newEmail) {
      return res.send({
        validationType: 'resetPassword',
        user: {
          id: req.user.id,
          email: req.user.email,
          name: req.user.name,
          rank: req.user.rank
        }
      });
    }

    const checkUser = await User.findOne({
      where: {
        email: req.user.newEmail
      }
    });

    if (checkUser) {
      user.update({
        newEmail: null,
        validation: null
      });
      return res.status(400).send({
        message: 'Email address in use by other account.',
        user: {}
      });
    }

    return res.send({
      validationType: 'changeEmail',
      user: {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
        rank: req.user.rank,
        newEmail: req.user.newEmail
      }
    });
  } catch (error) {
    return res.status(500).send({
      message: 'Internal server error.'
    });
  }
});

router.post('/register', getEmailCredentials, async (req, res) => {
  try {
    if (!checkEmail(req.body.email)) {
      return res.status(400).send({
        message: 'Mail must be in format 123@abc.com.'
      });
    }

    let user = await User.findOne({
      where: {
        email: req.body.email
      }
    });

    if (!user) {
      user = await User.create({
        email: req.body.email,
        validation: randomCode()
      });
    }

    if (!user.password) {
      await sendRegisterEmail(req.transport, user.email, user.validation);
    } else {
      await alreadyRegisteredEmail(req.transport, user.email);
    }

    return res.send({
      message: 'Verification email sent. Check your email to continue.'
    });
  } catch (error) {
    return res.status(500).send({
      message: 'Internal server error.'
    });
  }
});

router.post('/registervalidation', validate, async (req, res) => {
  try {
    if (!checkString(req.body.password, 8)) {
      return res.status(400).send({
        message: "'password' must be a password with at least " + '8 characters.'
      });
    }

    if (req.body.password === req.user.email) {
      return res.status(400).send({
        message: "'password' cannot be identical to email address."
      });
    }

    if (!checkString(req.body.name, 2, 40)) {
      return res.status(400).send({
        message: "'name' must be a string with at at least " + '2 and at most 40 characters.'
      });
    }

    const encryptedPassword = await bcrypt.hashSync(req.body.password, 10);
    req.user.update({
      password: encryptedPassword,
      name: req.body.name,
      validation: null
    });

    return res.send({
      message: 'User account registered.',
      user: {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
        rank: req.user.rank,
        jwt: toJWT({
          userId: req.user.id
        })
      }
    });
  } catch (error) {
    return res.status(500).send({
      message: 'Internal server error.'
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    if (!checkString(req.body.email)) {
      return res.status(400).send({
        message: "'email' must be the email address of the " + 'user that is logging in.'
      });
    }

    if (!checkString(req.body.password)) {
      return res.status(400).send({
        message: "'password' must be a valid password for the " + 'user that is logging in.'
      });
    }

    const user = await User.findOne({
      where: {
        email: req.body.email
      }
    });
    if (!user) {
      return res.status(400).send({
        message: 'Not existing user with this email. Try again!'
      });
    }

    const comparePassword = await bcrypt.compareSync(req.body.password, user.password);
    if (!comparePassword) {
      return res.status(400).send({
        message: 'Incorrect password. Try again!'
      });
    }

    if (user.email === superAdmin && user.rank < 4) {
      await user.update({
        rank: 4
      });
    }

    return res.send({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        profilePic: user.profilePic,
        rank: user.rank,
        jwt: toJWT({
          userId: user.id
        })
      }
    });
  } catch (error) {
    return res.status(500).send({
      message: 'Internal server error.'
    });
  }
});

router.post('/forgot-password', getEmailCredentials, async (req, res) => {
  try {
    let user = await User.findOne({
      where: {
        email: req.body.email
      }
    });
    if (!checkEmail(req.body.email)) {
      return res.send({
        message: 'This is not a valid email format.'
      });
    } else if (!user) {
      return res.send({
        message: 'Email address not found'
      });
    } else {
      user.update({
        validation: randomCode()
      });
      await ResetPassword(req.transport, user.email, user.validation);
    }

    return res.send({
      message: 'Verification email sent. Check your email to continue.'
    });
  } catch (error) {
    return res.status(500).send({
      message: 'Internal server error.'
    });
  }
});

router.post('/reset-password', validate, async (req, res) => {
  try {
    let user = await User.findOne({
      where: {
        email: req.body.email
      }
    });

    if (user.email) {
      if (!checkString(req.body.new_password, 8)) {
        return res.status(400).send({
          message: "'password' must be a password with at least " + '8 characters.'
        });
      } else {
        const encryptedPassword = await bcrypt.hashSync(req.body.new_password, 10);

        user.update({
          password: encryptedPassword,
          validation: null
        });
        return res.status(200).send({
          message: 'Password has changed'
        });
      }
    }
  } catch (error) {
    return res.status(500).send({
      message: 'Internal server error.'
    });
  }
});

module.exports = router;
