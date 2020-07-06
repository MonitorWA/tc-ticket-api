const crypto = require('crypto');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const sendEmail = require('../utils/sendEmail');
const User = require('../models/User');

// @desc      Register User
// @route     POST /api/auth/register
// @access    Public
exports.register = asyncHandler(async (req, res, next) => {
  const { Email, Login, UserName, UserPassword } = req.body;

  await User.sync({ force: true });

  // Create user
  const user = await User.create({
    Email,
    Login,
    UserName,
    UserPassword,
  });

  if (!user) {
    return next(new ErrorResponse(`Failed to create User`, 400));
  }

  sendTokenResponse(user, 200, res);
});

// @desc      Login User
// @route     POST /api/auth/login
// @access    Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return next(new ErrorResponse(`Please provide an email and password`, 400));
  }

  // Check for user
  const user = await User.findOne({ where: { Email: email } });

  if (!user) {
    return next(new ErrorResponse(`Invalid credentials`, 401));
  }

  // Check to see if account is locked out
  if (user.Locked) {
    // Unlock account after 5 minutes
    if (user.LastLogin < Date.now() - 5 * 60000) {
      user.Locked = false;
      user.FailedAttempts = 0;
      await user.save();
    }
    return next(new ErrorResponse(`Your account has been locked`, 400));
  } // Lock account on too many incorrect attempts
  else if (user.FailedAttempts > 4) {
    user.LastLogin = Date.now();
    user.Locked = true;
    await user.save();
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);
  // Handle invalid credentials. Add to FailedAttempts
  if (!isMatch) {
    user.FailedAttempts++;
    await user.save();
    return next(new ErrorResponse(`Invalid credentials`, 401));
  }

  user.FailedAttempts = 0;
  user.LastLogin = Date.now();
  await user.save();

  sendTokenResponse(user, 200, res);
});

// @desc      Logout User
// @route     GET /api/auth/logout
// @access    Private
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc      Get Current Logged In User
// @route     GET /api/auth/me
// @access    Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ where: { UserID: req.user.UserID } });

  if (!user) {
    return next(
      new ErrorResponse(`Cannot find user with ID of ${req.user.UserID}`)
    );
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc      Forgot password
// @route     POST /api/auth/forgotpassword
// @access    Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(
      new ErrorResponse(`There is no user with that email address`, 404)
    );
  }

  //Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save();

  // Create reset URL
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/auth/resetpassword/${resetToken}`;

  const message = `You are receiving this email because you or someone else has requested to reset your password. Please make a PUT request to: \n \n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.Email,
      subject: 'Password reset token',
      message,
    });

    return res.status(200).json({ success: true, data: 'Email sent' });
  } catch (err) {
    user.ResetPasswordToken = null;
    user.ResetPasswordExpire = null;

    await user.save();

    return next(new ErrorResponse(`Email could not be sent`, 500));
  }
});

// @desc      Update password
// @route     PUT /api/auth/updatepassword
// @access    Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ where: { UserID: req.user.UserID } });

  // Check current password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse(`Password is incorrect`, 401));
  }

  user.UserPassword = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// @desc      Update user details
// @route     PUT /api/auth/updatedetails
// @access    Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ where: { UserID: req.user.UserID } });

  if (!user) {
    return next(
      new ErrorResponse(`No user with the id ${req.user.UserID}`, 404)
    );
  }

  user.Login = req.body.Login;
  await user.save();

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc      Reset Password
// @route     POST /api/auth/resetpassword/:resettoken
// @access    Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    ResetPasswordToken: resetPasswordToken,
  });

  if (!user) {
    return next(new ErrorResponse(`Invalid token`, 400));
  } else if (user.ResetPasswordExpire < Date.now()) {
    return next(new ErrorResponse(`Reset token expired`, 400));
  }

  // Set new password
  user.UserPassword = req.body.password;
  user.ResetPasswordToken = null;
  user.ResetPasswordExpire = null;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({ success: true, token });
};
