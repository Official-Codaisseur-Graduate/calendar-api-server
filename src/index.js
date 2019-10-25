const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")

const authRouter = require("./auth")
const authMiddleware = require("./auth/auth")
const userRouter = require("./user")
const configRouter = require("./config")
const calendarRouter = require("./calendar")
const { databaseSync } = require("./database")
const { checkSuperAdmin } = require("./auth/superAdmin")

const app = express()
app.use(
  cors(),
  bodyParser.json(),
  authRouter,
  authMiddleware,  // authentication happens for every routes(endpoints)
  userRouter,
  configRouter,
  calendarRouter,
)

const port = process.env.PORT || 4000
app.listen(port, () => console.log(`Listening to :${port}`)) // starting the app on port 4000

databaseSync().then(checkSuperAdmin) // creating a superadmin when the  database is created