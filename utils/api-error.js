class ApiError extends Error {
  constructor(statusCode, message, isOperational = true, stack = '',success) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.success = success;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = ApiError;
