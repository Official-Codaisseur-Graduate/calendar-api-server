const User = require('../user/model');

const validate = async (req, res, next) => {
  try {
    if (!req.headers.validation) {
      return res.status(400).send({
        message: 'Validation code required.',
        user: {}
      });
    }

    const user = await User.findOne({
      where: { validation: req.headers.validation }
    });

    if (!user) {
      return res.status(400).send({
        message: 'Validation code invalid or expired.',
        user: {}
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).send({
      message: 'Internal server error.'
    });
  }
};

module.exports = validate;
