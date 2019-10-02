const Sequelize = require('sequelize')
const db = require('../db')

const User = db.define(
  'user', 
  {
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  rank: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  validation: Sequelize.STRING,
},
{
  timestamps: false,
  tableName: 'users'
})

module.exports = User