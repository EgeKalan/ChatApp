import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";


export const signup = async (req, res) => {
  const {fullName,email,password} = req.body;
  try {
    if(!fullName || !email || !password){
      return res.status(400).json({message: "Tüm bölmeler doldurulmadlıdır."});
    }
    if(password.length < 6){
      return res.status(400).json({message: "Şifre en az 6 karakter olmalıdır."});
    }

    const user = await User.findOne({email});

    if(user) return res.status(200).json({message: "Email alınmış"});

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);

    const newUser = new User({
      fullName: fullName,
      email: email,
      password: hashedPassword,
    })

    if(newUser){
      const token = generateToken(newUser._id,res)
      await newUser.save();
      res.status(201).json({
        _id:newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic:newUser.profilePic,
        token,
      })
    } else{
      res.status(400).json({message: "Kullanıcı oluşturulamadı."});
    }
    } catch (error) {
      console.log("SignUp da error", error.message);
      res.status(500).json({message: "server da hata oluştu."});
    }
  };
  
  export const login = async (req, res) => {
      const{email, password} = req.body;

    try {
      const user = await User.findOne({ email });

      if(!user){
        return res.status(400).json({message:"Bilgiler Eşleşmiyor..."})
      }

     const isPasswordCorrect = await bcrypt.compare(password, user.password)
     if(!isPasswordCorrect){
      return res.status(400).json({message:"Bilgiler Eşleşmiyor..."})
     }
      const token = generateToken(user._id);

      res.status(200).json({
        token,
        user: {
          _id:user._id,
          fullName: user.fullName,
          email: user.email,
          profilePic:user.profilePic,
        },
      });
    } catch (error) {
      console.log("Error in login controller", error.message);
      res.status(500).json({message:"Server Error"});
    }
  };
  
  export const logout = (req, res) => {
    try {
      res.cookie("jwt", "", {maxAge:0})
      res.status(200).json({message:"Kullanıcı Çıkış Yaptı."});
    } catch (error) {
      console.log("Çıkış yaparken sorun oldu", error.message);
      res.status(500).json({message:"Server Error"});
    }
  };
  
  
  export const updateProfile = async (req, res) => {
    try {
      const {profilePic} = req.body;
      const userId= req.user._id;

      if(!profilePic){
        return res.status(400).json({message:"Profil resmi gerekli"});
      }

      const uploadResponse = await cloudinary.uploader.upload(profilePic)
      const updatedUser = await User.findByIdAndUpdate(userId, 
        {profilePic: uploadResponse.secure_url}, 
        {new:true});

      res.status(200).json(updatedUser);
    } catch (error) {
      console.log("Profil resminde hata oluştu: ", error);
      res.status(500).json({message:"Server Error"});
    }
  };

  export const checkAuth = (req, res) => {
    try {
      res.status(200).json(req.user);
    } catch (error) {
      console.log("Error in checkAuth controller", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };