const Sequelize = require("sequelize")

const database = require("../database")

const Model = database.define("user",
  {
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
    },
    name: {
      type: Sequelize.STRING,
    },
    rank: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    newEmail: {
      type: Sequelize.STRING,
    },
    validation: {
      type: Sequelize.STRING,
    },
  },
  {
    tableName: "users",
    timestamps: false,
  },
)

module.exports = Model