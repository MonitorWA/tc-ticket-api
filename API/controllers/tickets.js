const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Ticket = require('../models/Ticket');

// @desc      Get Ticket Info
// @route     Get /api/ticket
// @access    Public
exports.getTicket = asyncHandler(async (req, res, next) => {
  try {
    const ticket = await Ticket.getTicket(req.params.cardNumber);
    res.status(200).json({ success: true, data: ticket });
  } catch (err) {
    return next(new ErrorResponse(`Ticket Invalid`, 404));
  }
});

exports.putEnterEventWithCard = asyncHandler(async (req, res, next) => {
  try {
    const result = await Ticket.putEnterEventWithCard(
      req.body.DeviceID,
      req.body.EventID,
      req.body.CardNumber,
      ''
    );

    res.status(200).json({ success: true, data: result });
  } catch (err) {
    return next(new ErrorResponse(`Ticket Invalid`, 404));
  }
});
