const Joi = require("joi");
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;


const userLoginSchema = Joi.object({
  username: Joi.string().min(5).max(30).required(),
  password: Joi.string().pattern(passwordPattern),
});

module.exports = userLoginSchema;
