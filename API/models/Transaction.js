const { Model } = require('sequelize');
const { db } = require('../sql');

class Transaction extends Model {
  static getTransactions = function (cardNumber, displayNumber) {
    return db.query(`exec sp_GetTransactions '${cardNumber}',${displayNumber}`);
  };
}

module.exports = Transaction;
