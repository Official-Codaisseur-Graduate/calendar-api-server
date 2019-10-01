const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const eventsRouter = require('./router')

const corsMiddleware = cors()
const jsonParser = bodyParser.json()
const port = process.env.PORT || 4000

const app = express()
app.use(
  corsMiddleware,
  jsonParser,
  eventsRouter,
)

app.get('/test', (req, res) => res.send('Hello test!'))
app.listen(port, () => console.log(`Listening to port ${port}`))