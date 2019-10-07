const { google } = require("googleapis")

const Config = require("../config/model")

const scopes = [
  // "https://mail.google.com",
  // "https://www.googleapis.com/auth/gmail.compose",
  // "https://www.googleapis.com/auth/gmail.modify",
  // "https://www.googleapis.com/auth/gmail.readonly",



  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/calendar.readonly",
]

let jwtClient = undefined

const resetClient = () => {
  jwtClient = undefined
}

const getClient = async (req, res, next) => {
  try {

    if (!jwtClient ||
      jwtClient.credentials.expiry_date < Date.now() + 10000) {

      const client_email_entry = await Config.findOne({
        where: { key: "client_email" }
      })
      if (!client_email_entry || !client_email_entry.data) {
        return res.status(503).send({
          message: "No Google API configuration set by admin."
        })
      }

      const private_key_entry = await Config.findOne({
        where: { key: "private_key" }
      })
      if (!private_key_entry || !private_key_entry.data) {
        return res.status(503).send({
          message: "No Google API configuration set by admin."
        })
      }

      jwtClient = new google.auth.JWT(
        client_email_entry.data,
        null,
        private_key_entry.data,
        scopes,
        sub = "thelscalendar@gmail.com"
      )

      await jwtClient.authorize()
        .then(() => console.log("Connected to Google API"))
    }

    req.jwtClient = jwtClient
    next()

  } catch (error) {
    console.error(error)
    return res.status(500).send({
      message: "Internal server error."
    })
  }
}

const getGmail = async (req, res, next) => {
  try {

    req.gmail = google.gmail({
      auth: req.jwtClient,
      version: "v1",
    })
    next()

  } catch (error) {
    console.error(error)
    return res.status(500).send({
      message: "Internal server error."
    })
  }
}

const getCalendar = async (req, res, next) => {
  try {

    req.calendar = google.calendar({
      auth: req.jwtClient,
      version: "v3",
    })
    next()

  } catch (error) {
    console.error(error)
    return res.status(500).send({
      message: "Internal server error."
    })
  }
}

const getCalendarId = async (req, res, next) => {
  try {

    const calendar_id_entry = await Config.findOne({
      where: { key: "calendar_id" }
    })
    if (!calendar_id_entry || !calendar_id_entry.data) {
      return res.status(503).send({
        message: "No Calendar ID configuration set by admin."
      })
    }

    req.calendarId = calendar_id_entry.data
    next()

  } catch (error) {
    console.error(error)
    return res.status(500).send({
      message: "Internal server error."
    })
  }
}

module.exports = {
  resetClient,
  getClient,
  getGmail,
  getCalendar,
  getCalendarId,
}