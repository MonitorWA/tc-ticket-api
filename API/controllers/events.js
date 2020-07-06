const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Event = require('../models/Event');

// @desc      Get Events
// @route     Get /api/event
// @access    Public
exports.getEvents = asyncHandler(async (req, res, next) => {
  try {
    const events = await Event.getEvents();
    res.status(200).json({ success: true, data: events });
  } catch (err) {
    return next(new ErrorResponse(`No Events Data`, 404));
  }
});

exports.getEvent = asyncHandler(async (req, res, next) => {
  try {
    const event = await Event.getEvent(req.params.eventID);
    res.status(200).json({ success: true, data: event });
  } catch (err) {
    return next(new ErrorResponse(`No Event Data`, 404));
  }
});

exports.getEventsDateRange = asyncHandler(async (req, res, next) => {
  try {
    const events = await Event.getEventsDateRange(
      req.body.startdate,
      req.body.enddate
    );
    res.status(200).json({ success: true, data: events });
  } catch (err) {
    return next(new ErrorResponse(`No Events Data`, 404));
  }
});
