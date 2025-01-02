import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.headers.authorization;


    console.log("token: ",token);
    if (!token) {
      console.log("Token eksik");
      return res.status(401).json({ message: "Token eksik" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded._id) {
      console.log("Geçersiz Token");
      return res.status(401).json({ message: "Geçersiz Token" });
    }

    const user = await User.findById(decoded._id).select("-password");
    if (!user) {
      console.log("Kullanıcı bulunamadı");
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    req.user = user;

    req.token = token;
    next();
    
  } catch (error) {
    console.error("Error in protectRoute:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};