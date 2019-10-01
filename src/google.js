const { google } = require("googleapis")
const fs = require("fs")              // For local file manipulation.
const readline = require("readline")  // For local file manipulation.

const { CREDENTIALS_PATH, TOKEN_PATH, SCOPES } = require("./settings.js")

const initializeCalendar = async () => {

  console.log("Loading the credentials from a Json file.")
  let credentials = undefined
  try {
    credentials = await loadJsonFile(CREDENTIALS_PATH)
    console.log("Credentials:", credentials)
  } catch (error) {
    console.error("An error occurred while trying to load the " +
      "credentials from a Json file:", error)
    return
  }

  console.log("Creating the Google API client.")
  let client = undefined
  try {
    client = createOAuth2Client(credentials)
  } catch (error) {
    console.error("An error occurred while trying to create the " +
      "Google API client:", error)
    return
  }

  console.log("Loading the token from a Json file.")
  let token = undefined
  try {
    token = await loadJsonFile(TOKEN_PATH)
    console.log("Token:", token)
  } catch (error) {
    console.error("An error occurred while trying to load the " +
      "token from a Json file:", error)
    console.log("Because the token could not be loaded, a new " +
      "token will be generated.")

    console.log("Getting the authorization URL.")
    let authURL = undefined
    try {
      authURL = getAuthUrl(client, SCOPES)
      console.log("Please visit the following site to generate " +
        "an authorization code:\n", authURL)
    } catch (error) {
      console.error("An error occurred while trying to get the " +
        "authorization URL:", error)
      return
    }

    console.log("Asking the user for the authorization code.")
    let authCode = undefined
    try {
      authCode = await askAuthCode("Enter the authorization code: ")
      console.log("Authorization code:", authCode)
    } catch (error) {
      console.error("An error occurred while asking the user " +
        "for the authorization code:", error)
      return
    }

    console.log("Generating the token.")
    try {
      token = await generateToken(client, authCode)
      console.log("Token:", token)
    } catch (error) {
      console.error("An error occurred while generating the " +
        "token:", error)
      return
    }

    console.log("Writing the token to a Json file.")
    try {
      await writeJsonFile(TOKEN_PATH, token)
    } catch (error) {
      console.error("An error occurred while writing the " +
        "token to a Json file:", error)
      console.log("Because this is not a critical step, the " +
        "application will continue to run.")
    }
  }

  console.log("Adding the token to the Google API client.")
  try {
    addTokenToClient(client, token)
  } catch (error) {
    console.error("An error occurred while trying to add the " +
      "token to the Google API client:", error)
    return
  }

  console.log("Google client:", client)

  console.log("Loading the upcoming events.")
  try {
    const calendarData = await loadEvents(client)
    return calendarData
  } catch (error) {
    console.error("An error occurred while trying to get the " +
      "upcoming events:", error)
  }
}

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
      else resolve(token)
    })
  })

// Add the token to the Google API client
const addTokenToClient = (oAuth2Client, token) =>
  oAuth2Client.setCredentials(token)

// Load the events from the calendar
const loadEvents = oAuth2Client =>
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
  initializeCalendar,
}