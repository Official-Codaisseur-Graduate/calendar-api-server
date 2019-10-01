const { loadCredentials, loadToken } = require("./google")
const express = require('express')
const app = express()
const port = process.env.PORT || 4000

const router = require('./router')
app.use(router)

app.get('/test', (req, res) => res.send('Hello test!'))
app.listen(port, () => console.log(`Listening to port ${port}`))

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