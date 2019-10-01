const { Router } = require("express")

const { loadEvents } = require("../google")

const router = new Router()

router.get("/events/:year/:month/:day", (req, res, next) => {
  console.log("Year:", parseInt(req.params.year))
  console.log("Month:", parseInt(req.params.month) - 1)
  console.log("Day:", parseInt(req.params.day))

  const startDate = new Date(
    parseInt(req.params.year),
    parseInt(req.params.month) - 1,
    parseInt(req.params.day),
    0, 0, 0, 0 // Set time of day to start of day.
  )

  const endDate = new Date(startDate)
  endDate.setDate(endDate.getDate() + 1)

  console.log("Start Date:", startDate.toString())
  console.log("End Date:", endDate.toString())

  loadEvents()
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