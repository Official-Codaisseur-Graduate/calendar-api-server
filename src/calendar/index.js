const { Router } = require('express')
const router = new Router()
const { initializeCalendar } = require("../google")


router.get(
  '/events',
  (req, res, next) => {
   initializeCalendar()
    .then(data => {
      const events = data.data.items
      res.send(events.map(event => {
        return {
          summary: event.summary,
          description: event.description,
          start: event.start.dateTime,
          end: event.end.dateTime
        }
      }))
    })
    .catch(err => next(err))
  })

module.exports = router