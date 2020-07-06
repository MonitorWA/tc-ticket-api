const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Transaction = require('../models/Transaction');

// @desc      Get Transactios
// @route     Get /api/Transaction/:cardNumber
// @access    Public
exports.getTransactions = asyncHandler(async (req, res, next) => {
  try {
    const transactions = await Transaction.getTransactions(
      req.body.cardNumber,
      req.body.numberOfTransactions
    );
    res.status(200).json({ success: true, data: transactions });
  } catch (err) {
    return next(new ErrorResponse(`No Transactions Data`, 404));
  }
});
