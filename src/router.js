const { Router } = require('express')
const router = new Router()

router.get(
'/',
(req, res, next) => {
Modulename
.findAll()
.then(data => res.json(data))
.catch(err => next(err))
})

module.exports = router