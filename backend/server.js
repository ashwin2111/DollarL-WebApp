const express = require("express");
const dotenv = require("dotenv");
const { chats } = require("./data/data");
const connectDB = require("./config/db");
const colors = require("colors");
const messageRoutes = require("./routes/messageRoutes");
const chatRoutes = require("./routes/chatRoutes");
const userRoutes = require("./routes/userRoutes");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");

dotenv.config();
connectDB();
const app = express();

//since we are taking the value from our frontend
//so we need to tell our server to accept that JSON Data
app.use(express.json()); //to accept JSON Data

app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api/user", userRoutes);
//api for our Chat Creation
console.log("Server Chat---");
app.use("/api/chat", chatRoutes);
//message routes
app.use("/api/message", messageRoutes);

//Error Handling MiddleWare/functions
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(
  PORT,
  console.log(`Server running on PORT ${PORT}...`.yellow.bold)
);
//app.listen() function which Binds and listens for connections on the specified host and port.

//-----------SOCKET.IO______
const io = require("socket.io")(server, {
  pingTimeout: 60000, //amount of time it will wait incase of inactive
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
