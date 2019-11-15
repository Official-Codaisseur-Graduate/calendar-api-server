const { Router } = require("express")
const bcrypt = require("bcryptjs")

const User = require("../user/model")
const validate = require("./validate")
const { toJWT } = require("./jwt")
const { getEmailCredentials } = require("../sendEmail/middleware")
const { checkEmail, checkString } = require("../checkData")
const randomCode = require("../randomCode")
const { sendRegisterEmail, alreadyRegisteredEmail, ResetPassword } =
  require("../sendEmail")
const { superAdmin } = require("./superAdmin")

const router = new Router()


router.get("/validation", validate, async (req, res) => {
  console.log("req.user.password / validation", req.user.password)
  console.log("req.user.newEmail / validation", req.user.newEmail)
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


// gets the email credentials finds the user with the email and creates a user in user model.
router.post("/register", getEmailCredentials, async (req, res) => {
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
      await sendRegisterEmail(req.transport, user.email, user.validation)
    } else {
      await alreadyRegisteredEmail(req.transport, user.email)
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


// SignUp validation after you click on the link from the email
router.post("/registervalidation", validate, async (req, res) => {
  try {

    // check if password is 8 characters long
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

    // check the name if it alteast has 2 characters and less than 40 characters
    if (!checkString(req.body.name, 2, 40)) {
      return res.status(400).send({
        message: "'name' must be a string with at at least " +
          "2 and at most 40 characters.",
      })
    }

    // storing the password by hashing it
    const encryptedPassword = await bcrypt
      .hashSync(req.body.password, 10)
    req.user.update({
      password: encryptedPassword,
      name: req.body.name,
      validation: null,
    })

    // sends the jwt to the frontend
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

// router.post("/register", async (req, res) => {
//   try {

//     if (!checkEmail(req.body.email)) {
//       return res.status(400).send({
//         message: "'email' must be an email address.",
//       })
//     }

//     let user = await User.findOne({
//       where: { email: req.body.email },
//     })
//     if (!user) {
//       user = await User.create({
//         email: req.body.email,
//         validation: randomCode(),
//       })
//     }

//     // If the user does not have a password set for their account,
//     // then the user must still be in the registration process.

//     if (!user.password) {
//       await sendRegisterEmail(user.email, user.validation)
//     } else {
//       await alreadyRegisteredEmail(user.email)
//     }

//     // Always return the following "verification email sent" message, 
//     // regardless whether the email is already found in the database,
//     // So users cannot go fish for which emails do or do not exist.
//     // The actual email that was sent above informs the user.

//     return res.send({
//       message: "Verification email sent. Check your email to continue.",
//     })

//   } catch (error) {
//     console.error(error)
//     return res.status(500).send({
//       message: "Internal server error.",
//     })
//   }
// })


/* 
   The login endpoint does the following:
     -- it checks whether the email and password matches the record in database.
     -- it sends
           -- user id,
           -- email,
           -- name,
           -- rank 
           -- JWT Token
*/


router.post("/login", async (req, res) => {
  console.log("req.body", req.body)
  try {

    if (!checkString(req.body.email)) {
      return res.status(400).send({
        message: "'email' must be the email address of the " +
          "user that is logging in.",
      })
    }

    if (!checkString(req.body.password)) {
      return res.status(400).send({
        message: "'password' must be a valid password for the " +
          "user that is logging in.",
      })
    }

    // Both of the following checks return the same error message,
    // So users cannot go fish for which emails do or do not exist.

    const user = await User.findOne({
      where: { email: req.body.email },
    })
    if (!user) {
      return res.status(400).send({
        message: "Email address not found or password incorrect.",
      })
    }

    const comparePassword = await bcrypt
      .compareSync(req.body.password, user.password)
    if (!comparePassword) {
      return res.status(400).send({
        message: "Email address not found or password incorrect.",
      })
    }

    // If this is the Super Admin, force rank to 4.

    if (user.email === superAdmin && user.rank < 4) {
      await user.update({
        rank: 4,
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



// finds the user with the email

// if have the email in database will gets the email reset password credentials
// update the validation code
// get message "Verification email sent. Check your email to continue."

// if not will get 400 HTTP status code and message "Email address not found"
router.post("/forgot-password", getEmailCredentials, async (req, res) => {
  try {
    let user = await User.findOne({
      where: { email: req.body.email },
    })
    if (!user) {
      return res.status(400).send({
        message: "Email address not found",
      })
    } else {
      user.update({
        validation: randomCode()
      })
      await ResetPassword(req.transport, user.email, user.validation)
    }

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




// finds the user with the email

// check if the new password is 8 characters long
// if not will get status 400 "'password' must be a password with at least " + "8 characters."

// if yes storing the new password by hashing it
// and set validation to null
// will get status 200 "Password has changed"

// the link can change to new password only one time
router.post('/reset-password', validate, async (req, res) => {
  // console.log("RESET PASSWORD", req.body)
  try {
    let user = await User.findOne({
      where: { email: req.body.email },
    })
    // console.log("USER", user.email)
    if (user.email) {
      // check if the new password is 8 characters long
      // set validation to null
      if (!checkString(req.body.new_password, 8)) {
        return res.status(400).send({
          message: "'password' must be a password with at least " +
            "8 characters.",
        })
      } else {
        // storing the new password by hashing it
        const encryptedPassword = await bcrypt
          .hashSync(req.body.new_password, 10)
        //Reset old password to new password
        user.update({
          password: encryptedPassword,
          validation: null,
        })
        return res.status(200).send({
          message: "Password has changed",
        })
      }
    }

  } catch (error) {
    console.error(error)
    return res.status(500).send({
      message: "Internal server error.",
    })
  }
})

module.exports = router