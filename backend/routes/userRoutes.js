//Here We Gonna Write All of Our Routes which are related to our User

const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
} = require("../controller/userController");
//creating instance of router from the express
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

//we use this router to create different different Routes(we can write "router.post() etc..
//but if you want to chain multiple request we can write "router.rout")
router.route("/").post(registerUser).get(protect, allUsers); //we are creating user searching API end points .get(allUsers);
//Protect Middileware-->Before moving to allUsers request, it have to go through protect middleware to authenticate the user

router.post("/login", authUser); //this is for login

//User Searching API

module.exports = router;
