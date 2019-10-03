const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")

const userRouter = require("./user")
const configRouter = require("./config")
const calendarRouter = require("./calendar")
const login = require('./auth/router')

const app = express()
app.use(
  cors(),
  bodyParser.json(),
  userRouter,
  calendarRouter,
  configRouter,
  userRouter,
  login
)

const port = process.env.PORT || 4000
app.listen(port, () => console.log(`Listening to :${port}`))