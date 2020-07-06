var express = require('express');
var router = express.Router();
const {
  getEvents,
  getEventsDateRange,
  getEvent,
} = require('../controllers/events');

const { protect, authorize } = require('../middleware/auth');

router.route('/').get(getEvents);
router.route('/:eventID').get(getEvent);
router.route('/eventsDateRange/').get(getEventsDateRange);
module.exports = router;
