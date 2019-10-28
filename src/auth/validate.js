const User = require("../user/model")


// finds a user based on the validation 
const validate = async (req, res, next) => {
  console.log("Req.headers.validation/validate", req.headers.validation)
  try {

    if (!req.headers.validation) {
      return res.status(400).send({
        message: "Validation code required.",
        user: {},
      })
    }

    const user = await User.findOne({
      where: { validation: req.headers.validation },
    })
    if (!user) {
      return res.status(400).send({
        message: "Validation code invalid or expired.",
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

module.exports = validate