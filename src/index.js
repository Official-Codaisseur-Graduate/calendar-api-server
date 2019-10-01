const express = require('express')
const app = express()
const port = process.env.PORT || 4000
const { initializeCalendar } = require("./google")
// const { initializeCalendar } = require("./example")

const router = require('./router')
app.use(router)

app.get('/test', (req, res) => res.send('Hello test!'))
app.listen(port, () => console.log(`Listening to port ${port}`))


const initialize = async () => {
  const calendarData = await initializeCalendar()
  console.log("Events:", calendarData.data.items)
}

initialize()