const Validators = require("./validators");

const validator = (validator) => {
  //! If validator is not exist, throw err
  if (!Validators.hasOwnProperty(validator))
    throw new Error(`'${validator}' validator is not exist`);

  return async function (req, res, next) {
    try {
      const { error } = await Validators[validator].validateAsync(req.body);
      if (error) {
        return next(error);
      }
      next();
    } catch (error) {
      return next(error);
    }
  };
};

module.exports = validator;
