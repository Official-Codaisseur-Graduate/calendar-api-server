const { google } = require("googleapis")

// const oAuth2Client = require("../client")

// let client = undefined
// oAuth2Client()
//   .then(result => client = result)
//   .catch(console.error)


const privatekey = require("../../privatekey.json")

const jwtClient = new google.auth.JWT(
  privatekey.client_email,
  null,
  privatekey.private_key,
  ["https://www.googleapis.com/auth/calendar.readonly"],
)
jwtClient.authorize()
  .then(() => console.log("Connected to Google API"))
  .catch(console.error)

const calendar = google.calendar({
  auth: jwtClient,
  version: "v3",
})

calendar.calendarList.list()
  .then(result => console.log(result.data))
  .catch(console.error)



// Load the events from the calendar
const loadEvents = async (startDate, endDate) =>
  new Promise(async (resolve, reject) => {
    calendar.events.list({
      calendarId: privatekey.calendar_id,
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