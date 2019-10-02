const { google } = require("googleapis")

const Config = require("../config/model")

let jwtClient = undefined
let calendar = undefined
let calendar_id = undefined

const buildClient = async () =>
  new Promise(async (resolve, reject) => {
    try {

      const client_email_entry = await Config.findOne({
        where: { key: "client_email" }
      })
      if (!client_email_entry || !client_email_entry.data) {
        return reject("No Google API configuration set by admin.")
      }

      const private_key_entry = await Config.findOne({
        where: { key: "private_key" }
      })
      if (!private_key_entry || !private_key_entry.data) {
        return reject("No Google API configuration set by admin.")
      }

      jwtClient = new google.auth.JWT(
        client_email_entry.data,
        null,
        private_key_entry.data,
        ["https://www.googleapis.com/auth/calendar.readonly"],
      )
      console.log("Client:", jwtClient)

      await jwtClient.authorize()
      console.log("Connected to Google API")
      resolve("Connected to Google API")

    } catch (error) {
      console.error("An error occurred while trying to initialize " +
        "the Google API client:\n", error)
      reject("Internal server error")
    }
  })

const checkClient = () =>
  new Promise(async (resolve, reject) => {
    try {
      await buildClient()

      calendar = google.calendar({
        auth: jwtClient,
        version: "v3",
      })

      const calendar_id_entry = await Config.findOne({
        where: { key: "calendar_id" }
      })
      if (!calendar_id_entry || !calendar_id_entry.data) {
        return reject("No Google API configuration set by admin.")
      }

      calendar_id = calendar_id_entry.data
      resolve("Connection OK")

    } catch (error) {
      console.error("An error occurred while trying to verify " +
        "the Google API client:\n", error)
      reject("Internal server error")
    }
  })

// Load the events from the calendar
const loadEvents = async (startDate, endDate) =>
  new Promise(async (resolve, reject) => {
    try {
      await checkClient()
      console.log("Calendar ID:", calendar_id)
      calendar.events.list({
        calendarId: calendar_id,
        timeMin: startDate.toISOString(),
        timeMax: endDate.toISOString(),
        singleEvents: true,
        orderBy: "startTime",
      }, (error, result) => {
        if (error) reject(error)
        else resolve(result)
      })

    } catch (error) {
      console.error("An error occurred while trying to load " +
        "the event data:\n", error)
      reject("Internal server error")
    }
  })

module.exports = {
  loadEvents,
}