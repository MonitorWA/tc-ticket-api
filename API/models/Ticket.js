const { Model } = require('sequelize');
const { db } = require('../sql');

class Ticket extends Model {
  static putIsTicketValid = function (deviceID, cardNumber) {
    return db.query(
      `exec sp_RunProcedure '${siteCode}','sp_GetDevices','${limit},${pageNo}'`
    );
  };

  static getTicket = function (cardNumber) {
    return db.query(`exec sp_GetTicket '${cardNumber}'`);
  };

  static putEnterEventWithCard = function (
    deviceID,
    EventID,
    cardNumber,
    result
  ) {
    return db.query(
      `exec sp_EnterEventWithCard ${deviceID},${EventID},'${cardNumber}','${result}'`
    );
  };
}

module.exports = Ticket;
