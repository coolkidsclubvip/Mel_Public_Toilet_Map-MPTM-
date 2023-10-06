const Joi = require("joi");

// Define a function that validates journal entry input using Joi
function validateToiletLocation(ToiletLocation) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(500).required(),
    female: Joi.boolean().required(),
    male: Joi.boolean().required(),
    wheelchair: Joi.boolean().required(),
    baby_facil: Joi.boolean().required(),
    operator: Joi.string().required(),
    lon: Joi.number().required(),
    lat: Joi.number().required(),
  });
  return schema.validate(ToiletLocation);
}

// Define a function that validates user input using Joi
function validateUser(user) {
  const schema = Joi.object({
    username: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().min(5).max(255).required(), //**.email() */
    password: Joi.string().min(3).max(100).required(),
    isAdmin: Joi.boolean(),
  });
  return schema.validate(user);
}

// Validate the login input data using a Joi schema
function validateLogin(data) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  return schema.validate(data);
}

module.exports.validateToiletLocation = validateToiletLocation;
module.exports.validateUser = validateUser;
module.exports.validateLogin = validateLogin;
