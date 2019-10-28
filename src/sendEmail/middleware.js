const nodemailer = require("nodemailer")

const Config = require("../config/model")

// check if the admin has provided the email for accessing the app. So if a user tries to sign up, they would fail with an alert "no send email confifuration set by admin"
const getEmailCredentials = async (req, res, next) => {
  try {

    const send_email_entry = await Config.findOne({
      where: { key: "send_email" }
    })
    if (!send_email_entry || !send_email_entry.data) {
      return res.status(503).send({
        message: "No send email configuration set by admin."
      })
    }

    const send_password_entry = await Config.findOne({
      where: { key: "send_password" }
    })
    if (!send_password_entry || !send_password_entry.data) {
      return res.status(503).send({
        message: "No send email configuration set by admin."
      })
    }

    req.transport = await nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: send_email_entry.data,
        pass: send_password_entry.data,
      },
    })
    next()

  } catch (error) {
    console.error(error)
    return res.status(500).send({
      message: "Internal server error."
    })
  }
}

module.exports = { getEmailCredentials }