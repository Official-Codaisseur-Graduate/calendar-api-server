const { google } = require("googleapis")
const fs = require("fs")              // For local file manipulation.
const readline = require("readline")  // For local file manipulation.

const { CREDENTIALS_PATH, TOKEN_PATH, SCOPES } = require("./settings.js")

const oAuth2Client = () =>
  new Promise(async (resolve, reject) => {

    let credentials = undefined
    try {
      credentials = await loadJsonFile(CREDENTIALS_PATH)
    } catch (error) {
      console.error("An error occurred while trying to load the " +
        "credentials from a Json file:", error)
      reject(error)
    }

    let client = undefined
    try {
      client = await createOAuth2Client(credentials)
    } catch (error) {
      console.error("An error occurred while trying to create the " +
        "Google API client:", error)
      reject(error)
    }

    let token = undefined
    try {
      token = await loadJsonFile(TOKEN_PATH)
    } catch (error) {
      console.error("An error occurred while trying to load the " +
        "token from a Json file:", error)
      console.log("Generating a new token to continue...")

      try {
        const authURL = await getAuthUrl(client, SCOPES)
        console.log("Please visit the following site to generate " +
          "an authorization code:\n", authURL)
      } catch (error) {
        console.error("An error occurred while trying to get the " +
          "authorization URL:", error)
        reject(error)
      }

      let authCode = undefined
      try {
        authCode = await askAuthCode("Enter the authorization code: ")
      } catch (error) {
        console.error("An error occurred while asking the user " +
          "for the authorization code:", error)
        reject(error)
      }

      try {
        token = await generateToken(client, authCode)
      } catch (error) {
        console.error("An error occurred while generating the " +
          "token:", error)
        reject(error)
      }

      try {
        await writeJsonFile(TOKEN_PATH, token)
      } catch (error) {
        console.error("An error occurred while writing the " +
          "token to a Json file:", error)
        console.log("Writing the token is not critical for " +
          "the functionality of this program. Continuing...")
      }
    }

    try {
      await addTokenToClient(client, token)
    } catch (error) {
      console.error("An error occurred while trying to add the " +
        "token to the Google API client:", error)
      reject(error)
    }
    // console.log("Client in generator:", client)
    resolve(client)
  })

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

module.exports = oAuth2Client