var express = require('express');
var router = express.Router();
const { getTicket, putEnterEventWithCard } = require('../controllers/tickets');

const { protect, authorize } = require('../middleware/auth');

router.route('/:cardNumber').get(getTicket);
router.route('/').put(putEnterEventWithCard);

module.exports = router;
