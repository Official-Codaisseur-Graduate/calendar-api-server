const { Router } = require('express');

const auth = require('../auth/auth');
const Config = require('../config/model');
const { getCalendar, getCalendarId } = require('./middleware');

const router = new Router();

router.get('/calendars', getCalendar, async (req, res) => {
  try {
    if (req.user.rank < 4) {
      return res.status(403).send({
        message: 'Only admin users can see all calendar IDs.'
      });
    }

    const calendar_id_entry = await Config.findOne({
      where: { key: 'calendar_id' }
    });

    req.calendar.calendarList.list(
      {
        showDeleted: true,
        showHidden: true
      },

      (error, result) => {
        if (error) {
          console.error(error);
          return res.status(500).send({
            message: 'Internal server error.'
          });
        }

        res.send({
          events: result.data.items.map(calendar => {
            if (calendar_id_entry && calendar.id === calendar_id_entry.data) {
              return {
                id: calendar.id,
                summary: calendar.summary,
                selected: true
              };
            }
            return {
              id: calendar.id,
              summary: calendar.summary
            };
          })
        });
      }
    );
  } catch (error) {
    return res.status(500).send({
      message: 'Internal server error.'
    });
  }
});

router.get('/events/:year/:month/', auth, getCalendar, getCalendarId, async (req, res) => {
  try {
    if (!req.user.rank) {
      return res.status(403).send({
        message: 'Only authorized users can load calendar data.'
      });
    }

    var firstDayOfMonth = new Date(parseInt(req.params.year), parseInt(req.params.month), 1, 1);
    var lastDayOfMonth = new Date(parseInt(req.params.year), parseInt(req.params.month) + 1, 1);

    req.calendar.events.list(
      {
        calendarId: req.calendarId,
        timeMin: firstDayOfMonth.toISOString(),
        timeMax: lastDayOfMonth.toISOString(),
        singleEvents: true,
        orderBy: 'starttime'
      },

      (error, result) => {
        if (error) {
          return res.status(500).send({
            message: 'Error'
          });
        }

        res.send({
          events: result.data.items.map(event => ({
            ...event
          }))
        });
      }
    );
  } catch (error) {
    return res.status(500).send({
      message: 'error Check.'
    });
  }
});

module.exports = router;
