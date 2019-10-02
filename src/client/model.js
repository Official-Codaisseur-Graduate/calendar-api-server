const Sequelize = require("sequelize")
const sequelize = require("../db")

const Model = sequelize.define("client",
  {
    // Credentials:
    client_id: Sequelize.STRING,
    client_secret: Sequelize.STRING,
    redirect_uri: Sequelize.STRING,

    // Token:
    access_token: Sequelize.STRING,
    refresh_token: Sequelize.STRING,
    scope: Sequelize.STRING,
    token_type: Sequelize.STRING,
    expiry_date: Sequelize.DATE,

    // Calendar ID:
    calendar_id: Sequelize.STRING,
  },
  {
    tableName: "client_credentials",
    timestamps: false,
  }
)

module.exports = Model