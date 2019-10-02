const Sequelize = require("sequelize")

const databaseUrl = process.env.DATABASE_URL ||
  "postgres://postgres:secret@localhost:5432/postgres"
const database = new Sequelize(databaseUrl)

database.sync({ force: false })
  .then(console.log("Connected to Database"))
  .catch(console.error)

module.exports = database