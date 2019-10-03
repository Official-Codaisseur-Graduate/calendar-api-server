const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")

const authRouter = require("./auth")
const authMiddleware = require("./auth/middleware")
const userRouter = require("./user")
const configRouter = require("./config")
const calendarRouter = require("./calendar")

const app = express()
app.use(
  cors(),
  bodyParser.json(),
  authRouter,
  authMiddleware,
  userRouter,
  configRouter,
  calendarRouter,
)

const port = process.env.PORT || 4000
app.listen(port, () => console.log(`Listening to :${port}`))