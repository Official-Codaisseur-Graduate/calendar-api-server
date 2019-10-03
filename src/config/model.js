const Sequelize = require("sequelize")
const sequelize = require("../database")

const Model = sequelize.define("configuration",
  {
    key: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    data: {
      type: Sequelize.STRING(4096),
    },
  },
  {
    tableName: "configuration",
    timestamps: false,
  },
)

module.exports = Model