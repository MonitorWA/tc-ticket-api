const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Card = require('../models/Card');

// @desc      Get Card
// @route     Get /api/Transaction/:cardNumber
// @access    Public
exports.getCard = asyncHandler(async (req, res, next) => {
  try {
    const card = await Card.getCard(req.params.cardID);
    res.status(200).json({ success: true, data: card });
  } catch (err) {
    return next(
      new ErrorResponse(`No Card  Data for Card '${req.params.cardID}'`, 404)
    );
  }
});
