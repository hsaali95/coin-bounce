const User = require("../models/user");
const bcrypt = require("bcryptjs");
const Joi = require("joi");

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;

const userController = {
  async changePassword(req, res, next) {
    console.log("req", req.user);
    // 1 validate fields
    // 2 find old passowrd
    // 3 if old password confirm then change password
    
    const userChangePassowrdSchema = Joi.object({
      password: Joi.string().pattern(passwordPattern).required(),
      confirmPassword: Joi.string().pattern(passwordPattern).required(),
      oldPassword: Joi.string().required(),
    });

    // validate fields 
    const { error } = userChangePassowrdSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const { password, confirmPassword, oldPassword } = req.body;
    const _id = req.user._id;
    let user;

    // find user by id
    user = await User.findById({ _id });

    // checking old password in db 
    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) {
      const error = {
        status: 409,
        message: "Old password not found",
      };
      return next(error);
    }

    // check new password and password written by client side 
    if (password !== confirmPassword) {
      const error = {
        status: 409,
        message: "Password not matched",
      };
      return next(error);
    }

    //   hash new password
    const hashedPassword = await bcrypt.hash(password, 10); //10 for extra security
    
    //   update password by id
    await User.updateOne({ _id }, { password: hashedPassword });
    return res.status(200).json({ message: "Password updated successfully" });
  },
};

module.exports = userController;
