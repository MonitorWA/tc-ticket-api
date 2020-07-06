var express = require('express');
var router = express.Router();
const { getCards, getCard } = require('../controllers/cards');

const { protect, authorize } = require('../middleware/auth');

//router.route('/').get(getCards);
router.route('/:cardID').get(getCard);

module.exports = router;
