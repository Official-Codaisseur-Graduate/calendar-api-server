const { Router } = require('express')
const router = new Router()
const { loadEvents } = require("./google")

router.get('/events', (req, res, next) => {
  loadEvents()
    .then(event => res.send(event.data.items))
    .catch(err => next(err))
})

module.exports = router