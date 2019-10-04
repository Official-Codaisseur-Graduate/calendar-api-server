const { Router } = require("express")

const { getCalendar, getCalendarId } = require("./middleware")

const router = new Router()

router.get("/events/:year/:month/:day",
  getCalendar, getCalendarId, (req, res) => {
    try {

      if (!req.user.rank) {
        return res.status(403).send({
          message: "Only authorized users can load calendar data.",
        })
      }

      const startDate = new Date(
        parseInt(req.params.year),
        parseInt(req.params.month) - 1,
        parseInt(req.params.day),
        0, 0, 0, 0 // Set time of day to start of day.
      )
      const endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + 1)

      req.calendar.events.list(
        {
          calendarId: req.calendarId,
          timeMin: startDate.toISOString(),
          timeMax: endDate.toISOString(),
          singleEvents: true,
          orderBy: "startTime",
        },

        (error, result) => {
          if (error) {
            console.error(error)
            return res.status(500).send({
              message: "Internal server error."
            })
          }

          res.send(result.data.items.map(event => ({
            ...event
            // summary: event.summary,
            // description: event.description,
            // start: event.start.dateTime,
            // end: event.end.dateTime
          })))
        }
      )

    } catch (error) {
      console.error("An error occurred while trying to load " +
        "the event data:\n", error)
      reject("Internal server error")
    }
  })

module.exports = router