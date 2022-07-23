const mongoose = require("mongoose");
//1.name/_id of the Sender
//2.Content of the Message
//3.refernce to the chat to which it belongs to

const messageModel = mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId, //we are looking for an id of different Object i.e ref:"User";
      ref: "User",
    },
    content: {
      type: String,
      trim: true,
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
  },
  {
    timestamps: true,
  }
);
const Message = mongoose.model("Message", messageModel);
module.exports = Message;
