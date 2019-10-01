const { google } = require("googleapis")

const oAuth2Client = require("./oAuth2Client")

// Load the events from the calendar
const loadEvents = () =>
  new Promise((resolve, reject) => {
    const calendar = google.calendar({
      auth: oAuth2Client,
      version: "v3",
    })

    calendar.events.list({
      calendarId: "primary",
      timeMin: (new Date()).toISOString(),
      maxResults: 10,
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