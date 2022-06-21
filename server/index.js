const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  var users={};
  io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);
    socket.on("new-user-joined",(username)=>{
      users[socket.id]=username;
      console.log(users);
      socket.broadcast.emit('user-connected', username);
      io.emit("users-list", users);
    })

  
  socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
        socket.broadcast.emit('user-disconnected', users=users[socket.id]);
        delete users[socket.id];
        io.emit("users-list", users);
      });

      socket.on('message',(data)=>{
        socket.broadcast.emit("message", {user: data.user, msg: data.msg});
    });
      })
      

 
 

server.listen(3001, () => {
    console.log("SERVER RUNNING");
  });