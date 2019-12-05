const Sequelize = require('sequelize');

const databaseUrl =
    process.env.DATABASE_URL ||
    'postgres://postgres:secret@localhost:5434/postgres';
const database = new Sequelize(databaseUrl);

const databaseSync = () =>
    database
        .sync({ force: false })
        .then(() => console.log('Connected to Database'))
        .catch(console.error);

module.exports = { database, databaseSync };
