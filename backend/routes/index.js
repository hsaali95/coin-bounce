const express = require("express");
const authController = require("../controller/authController");
const blogController = require("../controller/blogController");
const userController = require("../controller/userController");
const auth = require("../middlewares/auth");
const Validator = require("../middlewares/validator");

const router = express.Router();

//user

//register
router.post("/register", Validator("register"), authController.register);
// login
router.post("/login", authController.login);

//logout
router.post("/logout", auth, authController.logout);

//change password and user details
router.post("/user/changePassword", auth, userController.changePassword);
//refresh

//blog
// 1 create
router.post("/blog", auth, blogController.create);

// 2 get all
router.get("/blog/all", auth, blogController.getAll);

// 3 get by id
router.get("/blog/:id", auth, blogController.getById);

// 4 update
router.put("/blog", auth, blogController.update);

// 5 delete
router.delete("/blog/:id", auth, blogController.delete);

//comment
//creat comment
//read comments by blog id

module.exports = router;
