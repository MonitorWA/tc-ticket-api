const { Model } = require('sequelize');
const { db } = require('../sql');

class Card extends Model {
  static getCards = function () {
    return db.query(`exec sp_GetCards`);
  };

  static getCard = function (cardID) {
    return db.query(`exec sp_GetCard ${cardID}`);
  };
}

module.exports = Card;
