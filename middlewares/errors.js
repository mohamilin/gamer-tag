const httpStatus = require('http-status');
const {
  Sequelize
} = require('sequelize');

const logger = require('../config/logger');
const ApiError = require('../utils/api-error');

const errorConverter = (err, req, res, next) => {
  let error = err;
  console.log(err, 'MESSAGE Error');
  if (err instanceof Sequelize.DatabaseError) {
    const success = false;
    const statusCode = 500;
    const message = 'Database related error';
    error = new ApiError(statusCode, message, false, err.stack, success);
  }

 
  if (!(error instanceof ApiError)) {
    if (error.message === 'Validation error') {
      const condition = req.body.user_email && req.body.user_name ? `${req.body.user_email} dan ${req.body.user_name}` :
        req.body.user_name ?
        req.body.user_name :
        req.body.user_email

      const success = false;
      const statusCode = error.statusCode ? error.statusCode : httpStatus.BAD_REQUEST;
      const message = condition;

      error = new ApiError(statusCode, message, false, err.stack, success);
    }
    const success = false;
    const statusCode = error.statusCode ? error.statusCode : httpStatus.BAD_REQUEST;

    const message = error.message
    error = new ApiError(statusCode, message, false, err.stack, success);
  }

  next(error);
};

const errorHandler = (err, req, res, next) => {
  let {
    success,
    statusCode,
    message
  } = err;

  if (process.env.NODE_ENV === 'production' && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = err.message;

  const response = {
    success: success,
    code: statusCode,
    message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack
    }),
  };

  if (process.env.NODE_ENV === 'development') {
    logger.error(err);
  }

  res.status(statusCode).send(response);
  // res.render('error', {message: response.message, error: response})  // for web
};

module.exports = {
  errorConverter,
  errorHandler,
};