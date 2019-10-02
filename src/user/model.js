const Sequelize = require('sequelize')
const sequelize = require('../db')

const User = sequelize.define(
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