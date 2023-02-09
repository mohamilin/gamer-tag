const moment = require("moment");
const jwt = require("jsonwebtoken");

const ModelDatabase = require("../../database/models");
const Model = ModelDatabase.sequelize.models;

const httpStatus = require("http-status");
const ApiError = require("../../utils/api-error");

/**
 * Generate token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */

const generateToken = (
  userId,
  expires,
  type,
  secret = process.env.JWT_SECRET
) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

/**
 * Save a token
 * @param {string} token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<Token>}
 */

const saveToken = async (
  token,
  userId,
  expires,
  type,
  blacklisted = "false"
) => {
  const tokenDoc = await Model.tokens.create({
    token,
    memberId: userId,
    expires: expires.toDate(),
    type,
    blacklisted,
  });
  return tokenDoc;
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<Token>}
 */
const verifyToken = async (token, type) => {
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  const tokenDoc = await Model.tokens.findOne({
    where: {
      token,
      type
    }
  });
  if (!tokenDoc) {
    throw new Error("Token not found");
  }

  return tokenDoc;
};

const deleteToken = async(token, type) => {
  console.log('deleteToken', {token, type});
  return Model.tokens.destroy({
    where: {
      token,
      type
    }
  })
}
/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */

const generateAuthTokens = async (user) => {
  console.log(user, 'generate');
  const accessTokenExpires = moment().add(
    process.env.JWT_ACCESS_EXPIRATION_MINUTES,
    "minutes"
  );
  const accessToken = generateToken(
    user.id,
    accessTokenExpires,
    process.env.TOKEN_TYPE_ACCESS
  );

  const refreshTokenExpires = moment().add(
    process.env.JWT_REFRESH_EXPIRATION_DAYS,
    "days"
  );
  const refreshToken = generateToken(
    user.id,
    refreshTokenExpires,
    process.env.TOKEN_TYPE_REFRESH
  );
  await saveToken(
    refreshToken,
    user.id,
    refreshTokenExpires,
    process.env.TOKEN_TYPE_REFRESH
  );

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

/**
 * Generate reset password token
 * @param {string} email
 * @returns {Promise<string>}
 */
const generateResetPasswordToken = async (email) => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "No users found with this email");
  }
  const expires = moment().add(
    process.env.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    "minutes"
  );
  const resetPasswordToken = generateToken(
    user.id,
    expires,
    process.env.TOKEN_TYPE_RESET_PASSWORD
  );
  await saveToken(
    resetPasswordToken,
    user.id,
    expires,
    process.env.TOKEN_TYPE_RESET_PASSWORD
  );
  return resetPasswordToken;
};

/**
 * Generate verify email token
 * @param {User} user
 * @returns {Promise<string>}
 */
const generateVerifyEmailToken = async (user) => {
  const expires = moment().add(
    process.env.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
    "minutes"
  );
  const verifyEmailToken = generateToken(
    user.id,
    expires,
    process.env.TOKEN_TYPE_VERIFY_EMAIL
  );
  await saveToken(
    verifyEmailToken,
    user.id,
    expires,
    process.env.TOKEN_TYPE_VERIFY_EMAIL
  );
  return verifyEmailToken;
};

module.exports = {
  generateToken,
  saveToken,
  generateAuthTokens,
  generateResetPasswordToken,
  generateVerifyEmailToken,
  verifyToken,
  deleteToken
};
