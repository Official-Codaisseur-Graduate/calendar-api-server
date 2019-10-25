const jwt = require("jsonwebtoken")


// functions required for processing JWT token and converting the token to data to get user id

const secret = process.env.JWT_SECRET ||
  "$=zY$T+qPxiC#wXB7!Jq3UUX!mO&MVY*m8kyxRgUtpR@dPniVJzNof!!&iDld=np"

const toJWT = data =>
  jwt.sign(data, secret, { expiresIn: "2h" })

const toData = token => {
  try {
    return jwt.verify(token, secret)
  } catch (error) {
    return null
  }
}

module.exports = { toJWT, toData }