const { Router } = require("express")
const Sequelize = require("sequelize")

const User = require("./model")
const { checkInteger } = require("../checkData")

const router = new Router()

router.get("/users", async (req, res) => {
  try {

    if (req.user.rank < 3) {
      return res.status(403).send({
        message: "Only admin users and teacher users can see users.",
      })
    }

    const users = await User.findAll({
      attributes: ["id", "email", "name", "rank"],
      where: { password: { [Sequelize.Op.ne]: null } },
    })
    return res.send({
      users,
    })

  } catch (error) {
    console.error(error)
    return res.status(500).send({
      message: "Internal server error.",
    })
  }
})

router.put("/userrank/:id", async (req, res) => {
  try {

    if (req.user.rank < 3) {
      return res.status(403).send({
        message: "Only admin users and teacher users can set " +
          "user ranks.",
      })
    }

    if (!checkInteger(parseFloat(req.params.id), 1)) {
      return res.status(400).send({
        message: "User ID must be a positive round number.",
      })
    }

    if (req.user.id === parseInt(req.params.id)) {
      return res.status(403).send({
        message: "You cannot adjust your own user rank.",
      })
    }

    if (!checkInteger(parseFloat(req.body.rank), 0, 4)) {
      return res.status(400).send({
        message: "'rank' must be a round number between 0 and 4.",
      })
    }

    const user = await User.findByPk(parseInt(req.params.id))
    if (!user || !user.password) {
      return res.status(404).send({
        message: "User ID not found.",
      })
    }

    if (req.user.rank < 4 && parseInt(user.rank) > 2) {
      return res.status(403).send({
        message: "Only admin users can change the rank of an " +
          "admin or a teacher."
      })
    }

    if (req.user.rank < 4 && parseInt(req.body.rank) > 2) {
      return res.status(403).send({
        message: "Only admin users can set a user's rank to " +
          "admin or teacher.",
      })
    }

    user.update({
      rank: parseInt(req.body.rank),
    })
    return res.send({
      updateUser: {
        id: user.id,
        email: user.email,
        name: user.name,
        rank: user.rank,
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