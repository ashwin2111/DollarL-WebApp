//---we are creating the logic for registeration of User---

const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");

//------Registration API
//@description     Register new user
//@route           POST /api/user/
//@access          Public
//asyncHandler-->Simple middleware for handling exceptions inside of async express routes and passing them to your express error handlers.
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  //now if any of them is undefined we will throw an error
  if (!name || !email || !password) {
    res.status(400); //Bad Request->he server cannot or will not process the request due to something that is perceived to be a client error
    throw new Error("Please Enter all the Fields!");
  }

  //now we Check if the User Already Exists in our Database
  //We use "userModel" to structure our Data in Our Database
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User Already Exists");
  }

  //if Everything is fine and User don't Exists, WE create the User using User.create() and
  //this will Query our DataBase and create new field for new User
  const user = await User.create({
    name,
    email,
    password,
    pic,
  });
  //user gonna return the values of all fields
  if (user) {
    //means operations is successfully completed
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      /*JWT is used to Authorized the User in the Backend(i.e foreg. we logged in as User and we want User
        can only access the resources That is Avaible to Him). 
        User Login------>
        <-------server sends JWT after Login
        client send request with JWT------>
        <------this JWT will be verify by the Server and send the Response
        then, only User will be allowed to access that Resources.
      */
      //while sending this to User,I  also want JWT Token to be Sent
      token: generateToken(user._id),
    }); //we send this to our User
  } else {
    res.status(400);
    throw new Error("Failed To Create User");
  }
});

//----Login API
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //find if the user is in the Database or Not
  //@description     Auth the user
  //@route           POST /api/users/login
  //@access          Public
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      //isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

/********This is For Search Users API *********** */
//api/user
/*How can we send the data to the backend
There are Two Ways To Send it
1.Either We can send through the body(for this we have to use the post request)
We don't want to make post request, But we ll be using quereis for making this API  
(like api/user?search=value )*/

const allUsers = asyncHandler(async (req, res) => {
  //if we want to take id we use req.params
  //But if we want to take Query from our API ,write req.query()
  //req.query() property-->is an object containing the property for each query string parameter in the route.
  const keyword = req.query.search
    ? {
        //The $or operator performs a logical OR operation on an array of two or more <expressions>
        //and selects the documents that satisfy at least one of <expressions>.
        $or: [
          //$regex-->Provides regular expression capabilities for pattern matching strings in queries.
          //$options:"i"-->Case insensitivity to match upper and lower cases[others $options are "m",
          //"x("Extended" capability to ignore all white space characters)",
          //"s(Allows the dot character (i.e. .) to match all characters including newline characters.)"]
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {}; //(else)we are doing nothing

  //now we will query the database
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  //here we want all the search result but not the user that is currently login(find({_id:{$ne:req.user._id}}))
  res.send(users);
});
module.exports = { registerUser, authUser, allUsers };
