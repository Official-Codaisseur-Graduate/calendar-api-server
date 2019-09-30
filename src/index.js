const {
  loadJsonFile,
  writeJsonFile,
  createOAuth2Client,
  getAuthUrl,
  askAuthCode,
  generateToken,
  addTokenToClient,
  loadEvents,
} = require("./google")

const { CREDENTIALS_PATH, TOKEN_PATH, SCOPES } = require("./settings.js")

const initialize = async () => {
  let credentials = undefined
  let token = undefined
  let client = undefined

  console.log("Loading Credentials.")
  try {
    credentials = await loadJsonFile(CREDENTIALS_PATH)
  } catch (error) {
    console.error("An error occurred while trying to load the " +
      "credentials:", error)
    return
  }
  console.log("Credentials:", credentials)

  console.log("Creating Google API client.")
  const client = createOAuth2Client(credentials)

  console.log("Loading Token.")
  try {
    token = await loadJsonFile(TOKEN_PATH)
  } catch (error) {
    console.error("An error occurred while trying to load the " +
      "token:", error)

    console.log("Getting authorization URL.")
    const authURL = getAuthUrl(client, SCOPES)

    console.log("Please visit the following site to generate " +
      "an authorization code:/n", authURL)

    const authCode = askAuthCode("Enter the authorization code:")
    return
  }
  console.log("Token:", token)



  console.log("Loading Token.")
  try {
    token = await loadJsonFile(TOKEN_PATH)
    console.log("Token:", token)
  } catch (error) {
    console.error("An error occurred while trying to load the " +
      "token:", error)
  }
}

initialize()