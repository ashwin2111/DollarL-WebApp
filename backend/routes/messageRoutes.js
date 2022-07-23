//
const express = require("express");
const {
  allMessages,
  sendMessage,
} = require("../controller/messageControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/:chatId").get(protect, allMessages); //I want to fetch single message for a chat
router.route("/").post(protect, sendMessage); //protect is used--> as I want User To be Login inorder to access chats

module.exports = router;
