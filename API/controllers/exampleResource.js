const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc      Get all resources
// @route     GET /api/exampleResource
// @access    Public
exports.getResources = asyncHandler(async (req, res, next) => {
  let data;

  res.status(200).json({ success: true, data });
});

// @desc      Get single resource
// @route     GET /api/exampleResource/:id
// @access    Public
exports.getResource = asyncHandler(async (req, res, next) => {
  let data;

  res.status(200).json({ success: true, data });
});
