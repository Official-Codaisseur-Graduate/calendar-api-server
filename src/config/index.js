const express = require("express")
const bcrypt = require("bcryptjs")

const Config = require("./model")

const router = new express.Router()

router.get(                                             //GET ALL
  "/user",
  (req, res, next) => {
    User
      .findAll()
      .then(user => res.json(user))
      .catch(err => next(err))
  }
)

router.post(                                             //CREATE
  "/user", (req, res, next) => {
    const user = {
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
      name: req.body.name,
      rank: req.body, rank,
      validation: req.body.validation
    }
    User
      .create(user)
      .then(newUser => res.json(newUser))
      .catch(err => next(err))
  })

router.get(                                               //GET ONE USER
  "/user/:id",
  (req, res, next) => {
    User
      .findByPk(req.params.id)
      .then(user => res.json(user))
      .catch(err => next(err))
  }
)


module.exports = router