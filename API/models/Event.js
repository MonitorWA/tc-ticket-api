const { Model } = require('sequelize');
const { db } = require('../sql');

class Event extends Model {
  static getEvents = function () {
    return db.query(`exec sp_GetEvents`);
  };

  static getEvent = function (eventID) {
    return db.query(`exec sp_GetEvent ${eventID}`);
  };

  static getEventsDateRange = function (startdate, enddate) {
    return db.query(`exec sp_GetEventsDateRange '${startdate}','${enddate}'`);
  };
}

module.exports = Event;
