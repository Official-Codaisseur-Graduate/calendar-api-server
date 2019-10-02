const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

// const clientRouter = require("./client")
const calendarRouter = require('./calendar')

const corsMiddleware = cors()
const jsonParser = bodyParser.json()
const port = process.env.PORT || 4000

const app = express()
app.use(
  corsMiddleware,
  jsonParser,
  // clientRouter,
  calendarRouter,
)

app.get('/test', (req, res) => res.send('Hello test!'))
app.listen(port, () => console.log(`Listening to port ${port}`))


// const { google } = require("googleapis")
// const privatekey = require("../privatekey.json")

// const jwtClient = new google.auth.JWT(
//   privatekey.client_email,
//   null,
//   privatekey.private_key,
//   ["https://www.googleapis.com/auth/calendar.readonly"],
// )
// jwtClient.authorize()
//   .then(result => console.log("Success:", result))
//   .catch(error => console.error("Error:", error))

// const calendar = google.calendar({
//   auth: jwtClient,
//   version: "v3",
// })

// calendar.events.list({
//   calendarId: "primary",
//   // timeMin: startDate.toISOString(),
//   // timeMax: endDate.toISOString(),
//   singleEvents: true,
//   orderBy: "startTime",
// }, (error, result) => {
//   if (error) console.error("Error:", error)
//   else console.log("Result:", result)
// })