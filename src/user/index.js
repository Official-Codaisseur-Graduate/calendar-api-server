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

router.post(                                             //CREATE
  '/user', (req, res, next) => {
    const email = req.body.email
    const password = req.body.password
    const user = {
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
      name: req.body.name,
      rank: req.body.rank,
      validation: req.body.validation
    }
    if (!email || !password) {
      res.status(400).send({ message: 'Please enter a valid email and password' })
    } else {
      User
        .findOne({ where: { email: req.body.email } })
        .then(entity => {
          if (!entity) {
            res.status(400).send({ message: 'User with that email does not exist' })
          }
        })
    }
    User
      .create(user)
      .then(newUser => res.json(newUser))
      .catch(err => next(err))
  })

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