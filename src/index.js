const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const corsMiddleware = cors()
const jsonParser = bodyParser.json()
const port = process.env.PORT || 4000

const calendarRouter = require('./calendar')

const app = express()
app.use(
  corsMiddleware,
  jsonParser,
  calendarRouter
)

app.get('/test', (req, res) => res.send('Hello test!'))
app.listen(port, () => console.log(`Listening to port ${port}`))