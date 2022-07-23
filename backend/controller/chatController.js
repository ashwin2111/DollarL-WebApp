const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

//-------------CHAT API_________
//this route is responsible for creating or fetching a one-on-one chat
//we're goona take user id with which are going to create the chat
const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  //if the chat with this userId exits then return it
  //but if it doesn't exists then create the chat with this userId

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }
  //------populate() method is used to replace the user ObjectId field with
  //---the whole document consisting of all the user data.
  //---if we don't use populate() we won't get whole Document(instead we get only the userId);
  //--------------------------------------------
  //if chat exits with this user
  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { user: { $elemMatch: { $eq: req.user._id } } }, //userId ->currently login
      { user: { $elemMatch: { $eq: req.userId } } }, //userId-> that I have set
    ],
  })
    .populate("users", "-password") //populate()>>>>>
    .populate("latestMessage"); //if the chat is found populate the users Array;
  //--except password I need everything

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  }); //populate that user with latestMessage

  if (isChat.length > 0) {
    res.send(isChat[0]); //as no other user Exits with this two users(mathi ko)
  } else {
    //if chat doesnot exists we goona create new chat
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
      //it has both current login user and the userId with which we are trying to create the chat
    };

    //Now I am Quering and Storing in the Database
    try {
      const createdChat = await Chat.create(chatData);
      //now we send this data to the user
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).send(FullChat);
    } catch {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

//--------FETCH USER CHATS API__________
//@description     Fetch all chats for a user
//@route           GET /api/chat/
//@access          Protected

//here we need to check which user is loggin and just Query for that user all of the Chats that are in the dataBase
//we goona return all the chats that User is part of
const fetchChats = asyncHandler(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: res.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 }) //sort as per new messages
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(200).send(results);
      });
  } catch {
    res.status(400);
    throw new Error(error.message);
  }
});

//------------CREATE GROUP CHAT API _______

//@description     Create New Group Chat
//@route           POST /api/chat/group
//@access          Protected

//here we goona take bouch of users from the body and we goona take the name of the Group Chat
const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please Fill all the feilds" });
  }

  //we have to send array but we cannot send the array directly we need to send in stringify format from our frontend
  //and in the backend we nned to parse that stringify to objects
  //----When sending data to a web server, the data has to be a string.
  //----JSON.parse() takes a JSON string and then transforms it into a JavaScript object.
  var users = JSON.parse(req.body.users);

  if (users.length < 2) {
    //more than 2 users are required for groupChats
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }

  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//-------------RENAME GROUP API_________________
// @desc    Rename Group
// @route   PUT /api/chat/rename
// @access  Protected
const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
});

//----------ADD USER TO GROUP API______

// @desc    Add user to Group / Leave
// @route   PUT /api/chat/groupadd
// @access  Protected
const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(added);
  }
});

//----------REMOVE USER FROM GROUP API______
// @desc    Remove user from Group
// @route   PUT /api/chat/groupremove
// @access  Protected
const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(removed);
  }
});

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
