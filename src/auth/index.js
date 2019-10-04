const { Router } = require("express")
const bcrypt = require("bcryptjs")

const User = require("../user/model")
const validate = require("./validate")
const { toJWT } = require("./jwt")
const { checkEmail, checkString } = require("../checkData")
const randomCode = require("../randomCode")
const { sendRegisterEmail, alreadyRegisteredEmail } =
  require("../sendEmail")

const router = new Router()

router.get("/validation", validate, async (req, res) => {
  try {

    // If the user does not have a password set for their account,
    // then the user must still be in the registration process.

    if (!req.user.password) {
      return res.send({
        validationType: "register",
        user: {
          id: req.user.id,
          email: req.user.email,
          rank: req.user.rank,
        },
      })
    }

    // If the user does not have a newEmail set for their account,
    // then the user must be resetting their password.

    if (!req.user.newEmail) {
      return res.send({
        validationType: "resetPassword",
        user: {
          id: req.user.id,
          email: req.user.email,
          name: req.user.name,
          rank: req.user.rank,
        },
      })
    }

    // If the user has a newEmail set for their account,
    // then the user must be changing their email address.
    // Check if someone already uses that new email address.

    const checkUser = await User.findOne({
      where: { email: req.user.newEmail },
    })
    if (checkUser) {
      user.update({
        newEmail: null,
        validation: null,
      })
      return res.status(400).send({
        message: "Email address in use by other account.",
        user: {},
      })
    }

    return res.send({
      validationType: "changeEmail",
      user: {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
        rank: req.user.rank,
        newEmail: req.user.newEmail,
      },
    })

  } catch (error) {
    console.error(error)
    return res.status(500).send({
      message: "Internal server error.",
    })
  }
})

router.post("/register", async (req, res) => {
  try {

    if (!checkEmail(req.body.email)) {
      return res.status(400).send({
        message: "'email' must be an email address.",
      })
    }

    let user = await User.findOne({
      where: { email: req.body.email },
    })
    if (!user) {
      user = await User.create({
        email: req.body.email,
        validation: randomCode(),
      })
    }

    // If the user does not have a password set for their account,
    // then the user must still be in the registration process.

    if (!user.password) {
      await sendRegisterEmail(user.email, user.validation)
    } else {
      await alreadyRegisteredEmail(user.email)
    }

    // Always return the following "verification email sent" message, 
    // regardless whether the email is already found in the database,
    // So users cannot go fish for which emails do or do not exist.
    // The actual email that was sent above informs the user.

    return res.send({
      message: "Verification email sent. Check your email to continue.",
    })

  } catch (error) {
    console.error(error)
    return res.status(500).send({
      message: "Internal server error.",
    })
  }
})

router.post("/registervalidation", validate, async (req, res) => {
  try {

    if (!checkString(req.body.password, 8)) {
      return res.status(400).send({
        message: "'password' must be a password with at least " +
          "8 characters.",
      })
    }

    if (req.body.password === req.user.email) {
      return res.status(400).send({
        message: "'password' cannot be identical to email address.",
      })
    }

    if (!checkString(req.body.name, 2, 40)) {
      return res.status(400).send({
        message: "'name' must be a string with at at least " +
          "2 and at most 40 characters.",
      })
    }

    const encryptedPassword = await bcrypt
      .hashSync(req.body.password, 10)
    req.user.update({
      password: encryptedPassword,
      name: req.body.name,
      validation: null,
    })
    return res.status(400).send({
      message: "User account registered.",
      user: {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
        rank: req.user.rank,
        jwt: toJWT({ userId: req.user.id }),
      },
    })

  } catch (error) {
    console.error(error)
    return res.status(500).send({
      message: "Internal server error.",
    })
  }
})

router.post("/register", async (req, res) => {
  try {

    if (!checkEmail(req.body.email)) {
      return res.status(400).send({
        message: "'email' must be an email address.",
      })
    }

    let user = await User.findOne({
      where: { email: req.body.email },
    })
    if (!user) {
      user = await User.create({
        email: req.body.email,
        validation: randomCode(),
      })
    }

    // If the user does not have a password set for their account,
    // then the user must still be in the registration process.

    if (!user.password) {
      await sendRegisterEmail(user.email, user.validation)
    } else {
      await alreadyRegisteredEmail(user.email)
    }

    // Always return the following "verification email sent" message, 
    // regardless whether the email is already found in the database,
    // So users cannot go fish for which emails do or do not exist.
    // The actual email that was sent above informs the user.

    return res.send({
      message: "Verification email sent. Check your email to continue.",
    })

  } catch (error) {
    console.error(error)
    return res.status(500).send({
      message: "Internal server error.",
    })
  }
})

router.post("/login", async (req, res) => {
  try {

    if (!checkEmail(req.body.email)) {
      return res.status(400).send({
        message: "'email' must be an email address.",
      })
    }

    if (!checkString(req.body.password, 8)) {
      return res.status(400).send({
        message: "'password' must be a password with at least " +
          "8 characters.",
      })
    }

    // Both of the following checks return the same error message,
    // So users cannot go fish for which emails do or do not exist.

    const user = await User.findOne({
      where: { email: req.body.email },
    })
    if (!user) {
      return res.status(400).send({
        message: "Email address not found or password incorrect."
      })
    }

    const comparePassword = await bcrypt
      .compareSync(req.body.password, user.password)
    if (!comparePassword) {
      return res.status(400).send({
        message: "Email address not found or password incorrect."
      })
    }

    return res.send({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        rank: user.rank,
        jwt: toJWT({ userId: user.id }),
      },
    })

  } catch (error) {
    console.error(error)
    return res.status(500).send({
      message: "Internal server error.",
    })
  }
})

module.exports = router