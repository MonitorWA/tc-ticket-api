const { DataTypes, Model } = require('sequelize');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

class User extends Model {
  // static functions are class-level
  // non-static are only instance-level
  static classLevelMethod() {
    return 'foo';
  }

  // Sign JWT and return
  getSignedJwtToken() {
    return jwt.sign({ id: this.UserID }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
  }

  // Match user entered password to hashed password in database
  async matchPassword(enteredPassword) {
    return await bcrypt.compare(
      enteredPassword,
      this.getDataValue('UserPassword')
    );
  }

  // Generate and hash password token
  getResetPasswordToken() {
    // Generate token
    const resetToken = crypto.randomBytes(20).toDataTypes.STRING('hex');

    // Hash token and set to resetPasswordToken field
    this.ResetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Set expire
    this.ResetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return resetToken;
  }
}
User.init(
  {
    UserID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    Login: { type: DataTypes.STRING, allowNull: false },
    UserName: { type: DataTypes.STRING, allowNull: false },
    UserTypeID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    UserPassword: {
      type: DataTypes.STRING,
      allowNull: false,
      set(password) {
        this.setDataValue('UserPassword', hashPassword(password));
      },
    },
    ScanCode: {
      type: DataTypes.STRING,
    },
    Email: {
      type: DataTypes.STRING,
      validate: { isEmail: true },
      unique: true,
    },
    LastLogin: { type: DataTypes.DATE },
    DateCreated: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    Protected: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    PatronID: DataTypes.INTEGER,
    Source: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    Locked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    FailedAttempts: {
      type: DataTypes.SMALLINT,
      defaultValue: 0,
      allowNull: false,
    },
    ASPNetUserEmail: {
      type: DataTypes.STRING,
      validate: { isEmail: true },
    },
    ResetPasswordToken: DataTypes.STRING,
    ResetPasswordExpire: DataTypes.DATE,
  },
  { sequelize: db, tableName: 'teaUser', timestamps: false }
);

// Encrypt password using bcrypt
const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync();
  const hashed = bcrypt.hashSync(password, salt);
  console.log(hashed);
  return hashed;
};

module.exports = User;
