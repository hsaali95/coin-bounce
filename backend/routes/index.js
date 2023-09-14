const express = require("express");
const authController = require("../controller/authController");
const router = express.Router();

//user

//register
router.post("/register", authController.register);
// login
router.post("/login", authController.login);

//logout
//refresh

//blog
//CRUD
//read all blogs
//read blog by id
//update
//delete

//comment
//creat comment
//read comments by blog id

module.exports = router;
