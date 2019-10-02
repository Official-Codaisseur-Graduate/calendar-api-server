const { Router } = require("express")

const { loadEvents } = require("./calendarApi")

const router = new Router()

router.get("/events/:year/:month/:day", (req, res, next) => {
  const startDate = new Date(
    parseInt(req.params.year),
    parseInt(req.params.month) - 1,
    parseInt(req.params.day),
    0, 0, 0, 0 // Set time of day to start of day.
  )
  const endDate = new Date(startDate)
  endDate.setDate(endDate.getDate() + 1)

  loadEvents(startDate, endDate)
    .then(data => {
      const events = data.data.items
      res.send(events.map(event => {
        return {
          // As a temporary solution, return all event data.
          ...event

          // Once the frontend is more formalized, return specific data.
          // summary: event.summary,
          // description: event.description,
          // start: event.start.dateTime,
          // end: event.end.dateTime
        }
      }))
    })
    .catch(err => next(err))
})

module.exports = router