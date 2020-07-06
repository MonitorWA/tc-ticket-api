const { Op } = require('sequelize');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');

// @desc      Get all users from site
// @route     GET /api/users
// @access    Public
exports.getUsers = asyncHandler(async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    return next(new ErrorResponse(`No users found`, 404));
  }
});

// @desc      Get single user
// @route     GET /api/users/:id
// @access    Public
exports.getUser = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.params.id,
      },
      include: [{ model: Site }, { model: User, as: 'friends' }],
    });
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }
});

// @desc      Create a user
// @route     POST /api/users
// @access    Public
exports.createUser = asyncHandler(async (req, res, next) => {
  let newUserData;
  let foundSites;

  if (req.body.sites) {
    let siteCodesToCheck = [];
    for (let siteToAdd of req.body.sites) {
      siteCodesToCheck.push(siteToAdd.siteCode);
    }
    foundSites = await Site.findAll({
      where: {
        code: {
          [Op.or]: siteCodesToCheck,
        },
      },
    });

    newUserData = {
      ...req.body,
      currentSite: foundSites[0].code,
    };
  } else {
    newUserData = req.body;
  }

  const user = await User.create(newUserData);

  await user.addSites(foundSites);

  if (!user) {
    return next(new ErrorResponse(`User not created`, 400));
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc      Update a user
// @route     PUT /api/users/:id
// @access    Public
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({
    where: {
      id: req.params.id,
    },
    include: [Site],
  });

  let userData;

  if (req.body.sites) {
    let siteCodesToCheck = [];
    for (let siteToAdd of req.body.sites) {
      siteCodesToCheck.push(siteToAdd.siteCode);
    }
    const foundSites = await Site.findAll({
      where: { code: { [Op.or]: siteCodesToCheck } },
    });

    await user.addSites(foundSites);

    userData = {
      ...req.body,
      currentSite: foundSites[0].code,
    };
  } else {
    userData = req.body;
  }

  await user.update(userData);

  if (!user) {
    return next(
      new ErrorResponse(`No user found with id ${req.params.id}`, 400)
    );
  }

  res.status(200).json({ success: true, data: user });
});

// @desc      Delete a user
// @route     DELETE /api/users/:id
// @access    Public
exports.deleteUser = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    return next(
      new ErrorResponse(`No user found with id ${req.params.id}`, 400)
    );
  }
});
