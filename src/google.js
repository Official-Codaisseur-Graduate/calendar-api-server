const { google } = require("googleapis")
const fs = require("fs")              // For local file manipulation.
const readline = require("readline")  // For local file manipulation.

// Load data from a Json file
const loadJsonFile = fileName =>
  new Promise((resolve, reject) => {
    fs.readFile(fileName, (error, data) => {
      if (error) reject(error)
      else resolve(JSON.parse(data))
    })
  })

// Write data to a Json file
const writeJsonFile = (fileName, data) =>
  new Promise((resolve, reject) => {
    fs.writeFile(fileName, JSON.stringify(data), error => {
      if (error) reject(error)
      else resolve(true)
    })
  })

// Create a Google API client using the credentials
const createOAuth2Client = credentials =>
  new google.auth.OAuth2(
    credentials.installed.client_id,
    credentials.installed.client_secret,
    credentials.installed.redirect_uris[0])

// Generate the Url required to retrieve the code to generate the token
const getAuthUrl = (oAuth2Client, scope) =>
  oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope,
  })

// Ask for the authorization code in the terminal
const askAuthCode = question =>
  new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })
    rl.question(question, authCode => {
      if (authCode.trim()) resolve(authCode.trim())
      else reject(false)
    })
  })

// Generate the token using the authorization code
const generateToken = (oAuth2Client, authCode) =>
  new Promise((resolve, reject) => {
    oAuth2Client.getToken(authCode, (error, token) => {
      if (error) reject(error)
      else resolve(JSON.parse(token))
    })
  })

// Add the token to the Google API client
const addTokenToClient = (oAuth2Client, token) =>
  oAuth2Client.setCredentials(token)

// Load the events from the calendar
const loadEvents = oAuth2Client =>
  new Promise((resolve, reject) => {
    const calendar = google.calendar({ version: "v3", oAuth2Client })
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
  loadJsonFile,
  writeJsonFile,
  createOAuth2Client,
  getAuthUrl,
  askAuthCode,
  generateToken,
  addTokenToClient,
  loadEvents,
}