const User = require("../user/model")
const { toData } = require("./jwt")

const auth = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization &&
      typeof req.headers.authorization === "string" &&
      req.headers.authorization.split(" ")

    if (!authorization ||
      authorization[0] !== "Bearer" ||
      !authorization[1]) {
      return res.status(404).send({
        message: "Incorrect URL or authorization token required.",
        user: {},
      })
    }

    const data = toData(authorization[1])
    const user = data && await User.findByPk(data.userId)
    if (!user) {
      return res.status(401).send({
        message: "Authorization token invalid or expired.",
        user: {},
      })
    }

    req.user = user
    next()

  } catch (error) {
    console.error(error)
    return res.status(500).send({
      message: "Internal server error."
    })
  }
}

module.exports = auth