const { Router } = require('express')
const router = new Router()
const { initializeCalendar } = require("./google")


router.get(
'/events',
(req, res, next) => {
 initializeCalendar()
.then(event => res.send(event.data.items))
.catch(err => next(err))
})

module.exports = router