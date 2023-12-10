// const Validators = require("./validators");

// const validator = async (validator) => {
//   //! If validator is not exist, throw err
//   if (!Validators.hasOwnProperty(validator))
//     throw new Error(`'${validator}' validator is not exist`);

//   return async function (req, res, next) {
//     try {
//       const { error } = await Validators[validator].validateAsync(req.body);
//       if (error) {
//         next(error);
//       }
//     } catch (error) {
//       next(error);
//     }
//   };
// };

// module.exports = validator;

const Validators = require("./validators");

const validator = async (validator) => {
  //! If validator is not exist, throw err
  if (!Validators.hasOwnProperty(validator))
    throw new Error(`'${validator}' validator is not exist`);

  return async function (req, res, next) {
    try {
      const { error } = await Validators[validator].validateAsync(req.body);
      if (error) {
        next(error);
      }
    } catch (error) {
      next(error);
    }
  };
};

module.exports = validator;

