const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const corsMiddleware = cors()
const jsonParser = bodyParser.json()
const port = process.env.PORT || 4000

const login = require('./auth/router')

const calendarRouter = require('./calendar')
const userRouter = require('./user/index')

const app = express()

app.use(
  corsMiddleware,
  jsonParser,
  calendarRouter,
  userRouter,
  login
)

app.get('/test', (req, res) => res.send('Hello test!'))
app.listen(port, () => console.log(`Listening to port ${port}`))