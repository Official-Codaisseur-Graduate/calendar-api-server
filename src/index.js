const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")

const userRouter = require("./user")
const calendarRouter = require("./calendar")
const configRouter = require("./config")

const app = express()
app.use(
  cors(),
  bodyParser.json(),
  userRouter,
  calendarRouter,
  configRouter,
)

const port = process.env.PORT || 4000
app.listen(port, () => console.log(`Listening to :${port}`))