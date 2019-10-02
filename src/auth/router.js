const { Router } = require('express')
const { toJWT, toData } = require('./jwt')
const router = new Router()
const bcrypt = require('bcryptjs')
const User = require('../user/model')

router.post(
  '/login', 
  (req, res) => {
    const email = req.body.email
    const password = req.body.password

    if(!email || !password) {
      res.status(400).send({
        message: 'Please enter a valid email and password'
      })
    }else {
      
      User
      .findOne({ where: { 
        email: req.body.email 
        } 
      })
      .then(entity => {
        if (!entity) { 
          res.status(400).send({ 
            message: 'User with that email does not exist' 
      }) 
    }
    if (bcrypt.compareSync(req.body.password, entity.password)) {
      res.send({ 
        jwt: toJWT({ userId: entity.id }),
        userId: entity.id 
      })
    }else {
        res.status(400).send({ 
          message: 'Password was incorrect' 
        })
      }
    })
    .catch(err => {
      console.error(err)
      res.status(500).send({ 
        message: 'Something went wrong' 
      })
    })
  }
})

module.exports = router