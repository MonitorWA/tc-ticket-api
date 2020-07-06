const { Sequelize } = require('sequelize');

const host = process.env.DB_SERVER;
const database = process.env.DB_NAME;
const username = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const instanceName = process.env.DB_INSTANCE;

const db = new Sequelize({
  host,
  database,
  username,
  password,
  dialect: 'mssql',
  dialectOptions: {
    options: {
      encrypt: true,
      enableArithAbort: true,
      instanceName,
    },
  },
});

module.exports = db;
