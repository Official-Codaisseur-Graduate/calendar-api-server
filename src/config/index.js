const { Router } = require('express');
const bcrypt = require('bcryptjs');

const Config = require('./model');
const { checkEmail, checkString, checkPrivateKey } = require('../checkData');
const { resetClient } = require('../calendar/middleware');

const router = new Router();

router.post('/googleapi', async (req, res) => {
  try {
    if (req.user.rank < 4) {
      return res.status(403).send({
        message: 'Only admin users can set configuration.'
      });
    }

    if (!checkString(req.body.password)) {
      return res.status(400).send({
        message:
          "'password' must be a valid password for the " +
          'user that is updating the configuration.'
      });
    }

    if (!checkEmail(req.body.client_email)) {
      return res.status(400).send({
        message:
          'Client email must be a valid email address for the service account.'
      });
    }

    if (!checkPrivateKey(req.body.private_key)) {
      return res.status(400).send({
        message:
          'Private key must be a valid private key for the service account.'
      });
    }

    const comparePassword = await bcrypt.compareSync(
      req.body.password,
      req.user.password
    );
    if (!comparePassword) {
      return res.status(401).send({
        message: 'Admin password incorrect.'
      });
    }

    resetClient();

    const client_email_entry = await Config.findOne({
      where: { key: 'client_email' }
    });
    if (!client_email_entry) {
      await Config.create({
        key: 'client_email',
        data: req.body.client_email
      });
    } else {
      await client_email_entry.update({
        data: req.body.client_email
      });
    }

    const private_key_entry = await Config.findOne({
      where: { key: 'private_key' }
    });
    if (!private_key_entry) {
      await Config.create({
        key: 'private_key',
        data: req.body.private_key.replace(/\\n/g, '\n')
      });
    } else {
      await private_key_entry.update({
        data: req.body.private_key.replace(/\\n/g, '\n')
      });
    }

    return res.send({
      message: 'Google API configuration updated.'
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: 'Internal server error.'
    });
  }
});

router.post('/calendar', async (req, res) => {
  try {
    if (!checkEmail(req.body.calendar_id)) {
      return res.status(400).send({
        message: 'Calendar Id must be a valid email.'
      });
    }

    if (!checkString(req.body.password)) {
      return res.status(400).send({
        message: 'Wrong password.'
      });
    }

    const comparePassword = await bcrypt.compareSync(
      req.body.password,
      req.user.password
    );
    if (!comparePassword) {
      return res.status(401).send({
        message: 'Admin password incorrect.'
      });
    }

    const calendar_id_entry = await Config.findOne({
      where: { key: 'calendar_id' }
    });
    if (!calendar_id_entry) {
      await Config.create({
        key: 'calendar_id',
        data: req.body.calendar_id
      });
    } else {
      await calendar_id_entry.update({
        data: req.body.calendar_id
      });
    }

    return res.send({
      message: 'Calendar ID updated.'
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: 'Internal server error.'
    });
  }
});

router.post('/configemail', async (req, res) => {
  try {
    if (req.user.rank < 4) {
      return res.status(403).send({
        message: 'Only admin users can set configuration.'
      });
    }

    if (!checkString(req.body.password)) {
      return res.status(400).send({
        message:
          "'password' must be a valid password for the " +
          'user that is updating the configuration.'
      });
    }

    if (!checkEmail(req.body.send_email)) {
      return res.status(400).send({
        message: 'Send email must be a valid gmail address'
      });
    }

    if (!checkString(req.body.send_password, 1)) {
      return res.status(400).send({
        message: 'Send password must be your gmail address password.'
      });
    }

    const comparePassword = await bcrypt.compareSync(
      req.body.password,
      req.user.password
    );
    if (!comparePassword) {
      return res.status(401).send({
        message: 'Admin password incorrect.'
      });
    }

    const send_email_entry = await Config.findOne({
      where: { key: 'send_email' }
    });
    if (!send_email_entry) {
      await Config.create({
        key: 'send_email',
        data: req.body.send_email
      });
    } else {
      await send_email_entry.update({
        data: req.body.send_email
      });
    }

    const send_password_entry = await Config.findOne({
      where: { key: 'send_password' }
    });
    if (!send_password_entry) {
      await Config.create({
        key: 'send_password',
        data: req.body.send_password
      });
    } else {
      await send_password_entry.update({
        data: req.body.send_password
      });
    }

    return res.send({
      message: 'Send verifications email configuration updated.'
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: 'Internal server error.'
    });
  }
});

module.exports = router;
