const Sequelize = require("sequelize")
const sequelize = require("../db")

const Model = sequelize.define("configuration",
  {
    key: Sequelize.STRING,
    data: Sequelize.STRING(4096),
  },
  {
    tableName: "configuration",
    timestamps: false,
  },
)

module.exports = Model