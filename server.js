const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("login", ({ username, password }) => {
    socket.emit("login_result", {
      success: true,
      token: "demo-jwt-token",
      user: { id: username },
    });
  });

  socket.on("authenticate", (token) => {
    console.log("Authenticated with token:", token);
  });

  socket.on("send_message", (msg) => {
    io.emit("receive_message", msg);
  });

  socket.on("get_history", (channelId) => {
    socket.emit("history", {
      channelId,
      messages: [],
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(3000, () => {
  console.log("✅ Socket.IO server running at http://localhost:3000");
});
