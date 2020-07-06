const dotenv = require('dotenv');
const { Sequelize } = require('sequelize');

dotenv.config({ path: './config.env' });

const sequelize = new Sequelize({
  host: 'MONWEB',
  username: 'sa',
  password: 'Mon!30252',
  database: 'TotalControl_WASCC',
  dialect: 'mssql',
  dialectOptions: {
    options: {
      enableArithAbort: true,
      instanceName: 'SQL2019',
    },
  },
});

const connect = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to database established.'.magenta.bold);
  } catch (err) {
    console.log(`${err.message}`.red);
  }
};

connect();

exports.db = sequelize;
