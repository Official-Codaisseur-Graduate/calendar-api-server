const express = require('express')
const app = express()
const port = process.env.PORT || 4000

const eventsRouter = require('./router')
app.use(eventsRouter)

app.get('/test', (req, res) => res.send('Hello test!'))
app.listen(port, () => console.log(`Listening to port ${port}`))