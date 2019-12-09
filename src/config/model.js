const Sequelize = require('sequelize');
const { database } = require('../database');

const Model = database.define(
  'configuration',
  {
    key: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    data: Sequelize.STRING(4096)
  },
  {
    tableName: 'configuration',
    timestamps: false
  }
);

module.exports = Model;
