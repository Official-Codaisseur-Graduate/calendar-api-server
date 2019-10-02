const { google } = require("googleapis")

const oAuth2Client = require("../client")

let client = undefined
oAuth2Client()
  .then(result => client = result)
  .catch(console.error)

// Load the events from the calendar
const loadEvents = async (startDate, endDate) =>
  new Promise(async (resolve, reject) => {

    const calendar = google.calendar({
      auth: client,
      version: "v3",
    })

    calendar.events.list({
      calendarId: "primary",
      timeMin: startDate.toISOString(),
      timeMax: endDate.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
    }, (error, result) => {
      if (error) reject(error)
      else resolve(result)
    })
  })

module.exports = {
  loadEvents,
}