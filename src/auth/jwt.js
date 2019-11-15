const jwt = require("jsonwebtoken")

// functions required for processing JWT token and converting the token to data to get user id
const secret = process.env.JWT_SECRET || "$=zY$T+qPxiC#wXB7!Jq3UUX!mO&MVY*m8kyxRgUtpR@dPniVJzNof!!&iDld=np"

const toJWT = data => {
  // Production
  if (process.env.PORT) {
    return jwt.sign(data, secret, {
      expiresIn: '15m' // Token which experires in 15 minutes
    })
  }

  // Development - testing
  return jwt.sign(data, secret, {
    expiresIn: '24h' // Token which experires in 24 hours
  })
}

const toData = token => {
  try {
    return jwt.verify(token, secret)
  } catch (error) {
    return null
  }
}

module.exports = {
  toJWT,
  toData
}