import {Server as Ser} from "socket.io";

import http from "http";
import express from "express";

import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import { reverse } from "dns";

const app = express();
const server = http.createServer(app);


const io = new Ser(server, {
    cors: {
        origin: ["http://localhost:3000", "https://your-react-app.com"]
    },
});

export function getReceiverSocketId(userId) {
  console.log("userSocketMap", userSocketMap, userId, userSocketMap[userId])
    return userSocketMap[userId];
};

const userSocketMap = {};

io.on("connection", (socket) => {
    console.log("User connected", socket.id);

    const userId = socket.handshake.query.userId;
    console.log("userId", userId);

    if (userId) {

      if(userSocketMap[userId]) {
        const previousSocketId = userSocketMap[userId];
        io.sockets.sockets.get(previousSocketId)?.disconnect();
        console.log("Previous socket disconnected", previousSocketId);
      }

        userSocketMap[userId] = socket.id;
        console.log("User registered:", userId, socket.id);
    }

    io.emit("getOnlineUser", Object.keys(userSocketMap));

    socket.on("sendMessage", async ({senderId, receiverId, text, imageUrl }) => {
        try {
          if(!senderId || !receiverId) {
            return console.log("hata", senderId, receiverId, text, imageUrl);
          } 
          const newMessage =  new Message({
            senderId,
            receiverId,
            text: imageUrl ? null : text,
            imageUrl: imageUrl || null,
            type: imageUrl ? "image" : "message",
            timeStamp: Date.now(),
          });

          await newMessage.save();

          const receiverSocketId = getReceiverSocketId(receiverId);
          socket.emit("receiveMessage", newMessage)

          console.log("receiverSocketId", userSocketMap, userId, userSocketMap[userId])
          if (receiverSocketId) {
            io.to(receiverSocketId).emit("receiveMessage", newMessage);
          }
        } catch (error) {
          console.error("Mesaj hatası: ", error.message);
        }
      });
 
      socket.on("disconnect", () => {
        console.log("User disconnected", socket.id);
        Object.keys(userSocketMap).forEach((key) => {
          if (userSocketMap[key] === socket.id) {
            delete userSocketMap[key];
          }
        });
    
        io.emit("getOnlineUsers", Object.keys(userSocketMap)); 
      });
});


export {io, app, server};