import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
    try {
      const loggedInUserId = req.user._id;
      const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
  
      res.status(200).json(filteredUsers);
    } catch (error) {
      console.error("Error in getUsersForSidebar: ", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  export const getMessages = async (req, res) => {
    try {
      const { id: receiverId } = req.params;
      const userId = req.user._id;
  
      const messages = await Message.find({
        $or: [
          { senderId: userId, receiverId: receiverId },
          { senderId: receiverId, receiverId: userId },
        ],
      });
  
      res.status(200).json(messages);
    } catch (error) {
      console.log("Error in getMessages controller: ", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  };


  export const sendImage = async (req, res) => {
    try {
      console.log("test",req.files);
      const { image } = req.files;
      
      if (!image) {
        console.log("no image");
        return res.status(400).json({ message: "Lütfen bir resim gönderin." });
      }
      console.log("test")
        const uploadResponse = await cloudinary.uploader.upload(image.tempFilePath);
        console.log("resim123");
        const imageUrl = uploadResponse.secure_url;

      res.status(201).json({url: imageUrl});
    } catch (error) {
      console.error("Resim gönderme sırasında hata oluştu:", error.message);
      res.status(500).json({ error: "Sunucu hatası" });
    }
  };
  