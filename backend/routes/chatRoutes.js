const express = require("express");
const { protect } = require("../middleware/authMiddleware");
//only login user can access this chat
const {
  accessChat,
  fetchChats,
  createGroupChat,
  removeFromGroup,
  renameGroup,
  addToGroup,
} = require("../controller/chatController");
const router = express.Router();

router.route("/").post(protect, accessChat);
console.log("Fetch Chats......");
router.route("/").get(protect, fetchChats);

router.route("/group").post(protect, createGroupChat);
router.route("/rename").put(protect, renameGroup); //update

router.route("/groupremove").put(protect, removeFromGroup);
router.route("/groupadd").put(protect, addToGroup);

module.exports = router;
