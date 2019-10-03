const { Router } = require("express")
const bcrypt = require("bcrypt")

const User = require("../user/model")
const { toJWT } = require("./jwt")
const { checkEmail, checkString } = require("../checkData")

const router = new Router()

router.post("/login", (req, res) => {
  try {

    if (!checkEmail(req.body.email)) {
      return res.status(400).send({
        message: "'email' must be an email address.",
      })
    }

    if (!checkString(req.body.password, 8)) {
      return res.status(400).send({
        message: "'password' must be a password with at least " +
          "8 characters.",
      })
    }

    const user = await User.findOne({
      where: { email: req.body.email },
    })
    if (!user) {
      return res.status(400).send({
        message: "Email address not found or password incorrect."
      })
    }

    const password = await bcrypt
      .compareSync(req.body.password, user.password)
    if (!comparePassword) {
      return res.status(400).send({
        message: "Email address not found or password incorrect."
      })
    }

    return res.send({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        rank: user.rank,
        jwt: toJWT({ userId: user.id }),
      },
    })

  } catch (error) {
    console.error(error)
    return res.status(500).send({
      message: "Internal server error.",
    })
  }
})

module.exports = router