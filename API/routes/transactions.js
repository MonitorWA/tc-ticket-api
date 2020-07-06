var express = require('express');
var router = express.Router();
const { getTransactions } = require('../controllers/transactions');

const { protect, authorize } = require('../middleware/auth');

router.route('/').get(getTransactions);
module.exports = router;
