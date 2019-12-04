const Sequelize = require('sequelize');
const { database } = require('../database');

const Model = database.define(
  'user',
  {
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    password: Sequelize.STRING,
    name: Sequelize.STRING,
    profilePic: Sequelize.STRING,
    rank: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    newEmail: Sequelize.STRING,
    validation: {
      type: Sequelize.STRING,
      unique: true
    }
  },
  {
    tableName: 'users',
    timestamps: false
  }
);

module.exports = Model;
