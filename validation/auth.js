const Joi = require("joi");

const register = {
  body: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    password: Joi.string().required(),
    age: Joi.number()
  }),
};

module.exports = {
  register,
};
