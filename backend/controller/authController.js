const Joi = require("joi");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const UserDto = require("../dto/user");
const JWTService = require("../services/JWTService");
const RefreshToken = require("../models/token");

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;

const authController = {
  async register(req, res, next) {
    // // 1. validate user input
    // const userRegisterSchema = Joi.object({
    //   username: Joi.string().min(5).max(30).required(),
    //   name: Joi.string().max(30).required(),
    //   email: Joi.string().email().required(),
    //   password: Joi.string().pattern(passwordPattern).required(),
    //   confirmPassword: Joi.ref("password"),
    // });
    // const { error } = userRegisterSchema.validate(req.body);

    // // 2. if error in validations -> return error via middleware
    // if (error) {
    //   return next(error);
    // }

    // 3. if email or username is already registered - > user or email exits
    const { username, name, email, password } = req.body;
    try {
      const emailInUse = await User.exists({ email });

      const usernameInUse = await User.exists({ username });

      if (emailInUse) {
        const error = {
          status: 409,
          message: "Email already registered, use another email!",
        };

        return next(error);
      }

      if (usernameInUse) {
        const error = {
          status: 409,
          message: "Username not available, choose another username!",
        };

        return next(error);
      }
    } catch (error) {
      return next(error);
    }
    // 4. if no error hash passowrd
    const hashedPassword = await bcrypt.hash(password, 10); //10 for extra security
    let accessToken;
    let refreshToken;
    let user;
    try {
      const userToRegister = new User({
        username,
        name,
        email,
        password: hashedPassword,
      });
      user = await userToRegister.save();

      // token generation
      accessToken = JWTService.signAccessToken({ _id: user._id }, "30m");
      refreshToken = JWTService.signRefreshToken({ _id: user._id }, "60m");
    } catch (error) {
      return next(error);
    }
    // store refresh token in db
    await JWTService.storeRefreshToken(refreshToken, user._id);

    // send tokens in cookies
    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });
    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });
    // 5. store user data in db

    // 6. response send
    const userDto = new UserDto(user);
    return res.status(201).json({ user: userDto, auth: true });
  },

  async login(req, res, next) {
    // step 1 validate user
    const userLoginSchema = Joi.object({
      username: Joi.string().min(5).max(30).required(),
      password: Joi.string().pattern(passwordPattern),
    });
    const { error } = userLoginSchema.validate(req.body);
    if (error) {
      next(error);
    }

    // step 2 match username and password
    const { username, password } = req.body;
    let user;
    try {
      // match user name
      //user name se pore user ka record mila ga
      user = await User.findOne({ username: username });
      if (!user) {
        const error = {
          status: 401,
          message: "Invalid username or password",
        };
        return next(error);
      }

      // match password
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        const error = {
          status: 401,
          message: "Invalid password",
        };
        return next(error);
      }
    } catch (error) {
      return next(error);
    }

    // generate tokens
    const accessToken = JWTService.signAccessToken({ _id: user._id }, "30m");
    const refreshToken = JWTService.signRefreshToken({ _id: user._id }, "60m");

    // update refresh tokens in database
    try {
      await RefreshToken.updateOne(
        {
          _id: user._id, //filter id
        },
        {
          token: refreshToken,
        },
        {
          upsert: true, // means if find matching record update it if not add record
        }
      );
    } catch (error) {
      return next(error);
    }

    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true, //for security purpose
    });
    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true, //for security purpose
    });

    // response send
    const userDto = new UserDto(user);
    return res.status(200).json({ user: userDto, auth: true });
  },
  async logout(req, res, next) {
    console.log(req)
    // delete refresh token from db
    const { refreshToken } = req.cookies;

    try {
      await RefreshToken.deleteOne({ token: refreshToken });
    } catch (error) {
      return next(error);
    }

    // clear cookies 
    res.clearCookie("refreshToken")
    res.clearCookie("accessToken")

    //send response
    res.status(200).json({ user: null, auth: false });
  },
};
module.exports = authController;
