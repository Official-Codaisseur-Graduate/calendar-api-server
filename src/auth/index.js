const { Router } = require("express")
const bcrypt = require("bcrypt")

const User = require("../user/model")
const { toJWT } = require("./jwt")
const { checkEmail, checkString } = require("../checkData")
const randomCode = require("../randomCode")
const { sendRegisterEmail, alreadyRegisteredEmail } =
  require("../sendEmail")

const router = new Router()

router.get("/validate", async (req, res) => {
  try {

    if (!checkString(req.body.validation)) {
      return res.status(400).send({
        message: "'validation' must be a validation code string.",
      })
    }

    const user = await User.findOne({
      where: { validation: req.body.validation },
    })
    if (!user) {
      return res.status(400).send({
        message: "Validation code not found."
      })
    }

    // If the user does not have a password set for their account,
    // then the user must still be in the registration process.

    if (!user.password) {
      return res.send({
        vaidationType: "register",
      })
    }

    // If the user does not have a newEmail set for their account,
    // then the user must be resetting their password.

    if (!user.password) {
      return res.send({
        vaidationType: "resetpassword",
      })
    }



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

      user = await User.findOne({
        where: { newEmail: req.body.email },
      })
      if (!user) {

        user = await User.create({
          email: req.body.email,
          validation: randomCode(),
        })
      }
    }

    // If the user does not have a password set for their account,
    // then the user must still be in the registration process.

    if (!user.password) {
      await sendRegisterEmail(user.email, user.validation)
    }

    // If the user has the email set as their new email,
    // then the user must still be in the registration process.




    else {
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

    const password = await bcrypt
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