const { loadCredentials, loadToken } = require("./google")

const initialize = async () => {
  console.log("Loading Credentials.")
  try {
    credentials = await loadCredentials()
    console.log("Credentials:", credentials)
  } catch (error) {
    console.error("An error occurred while trying to load the " +
      "credentials:", error)
  }

  console.log("Loading Token.")
  try {
    token = await loadToken()
    console.log("Token:", token)
  } catch (error) {
    console.error("An error occurred while trying to load the " +
      "token:", error)
  }
}

initialize()