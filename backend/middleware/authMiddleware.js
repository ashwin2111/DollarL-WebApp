// The Authorization middleware, which uses the Authorize attribute to check for permissions runs
// it much before the execution of the page handler or the action method.
//  Hence it does not have the access to the data or resource on which the page or action method operates.

const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
//I can get all the Users Details from the DataBase;

const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  //1--> it goona check if req.headers.authorization(so in our request, we send our token inside of oue headers of the request)
  //
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      //token looks Like this---> Bearer ajhfjfjhdskhd  (from here we remove the Bearer and just take token)
      token = req.headers.authorization.split(" ")[1];

      //decodes token id
      //JWT verify method ---> is used for verify the token the take two arguments one is token string value,
      //and second one is secret key for matching the token is valid or not.
      //The validation method ---> returns a decode object that we stored the token in
      const decoded = jwt.verify(token, "ashwin");

      //We goona find the user in our database and return the user without the password
      req.user = await User.findById(decoded.id).select("-password");
      //with the help of id I am getting the user Details(Document from the DataBase)

      next();
      //if there was not next() here, then our request would not have gone from this asyn fucnction()
      //as route handler of the root path terminates the request-response cycle.
      //So Here next()--->passes the request to the next middleware function in the stack.
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

module.exports = { protect };
