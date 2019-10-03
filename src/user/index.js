const { Router } = require('express')
const router = new Router()
const User = require('./model')
const bcrypt = require('bcrypt')

router.get(                                             //GET ALL
  '/user',
  (req, res, next) => {
    User
      .findAll()
      .then(user => res.json(user))
      .catch(err => next(err))
  }
)

router.get(                                               //GET ONE USER
  '/user/:id',
  (req, res, next) => {
    User
      .findByPk(req.params.id)
      .then(user => res.json(user))
      .catch(err => next(err))
  }
)

module.exports = router