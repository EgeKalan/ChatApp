import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import fileUpload from "express-fileupload";


import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import {app, server} from "./lib/socket.js";


dotenv.config();

const PORT = process.env.PORT

app.use(express.json());
app.use(cookieParser());
app.use(fileUpload({ useTempFiles: true }));

app.use(cors(
  {
    origin: ["http://localhost:3000", "https://your-react-app.com"],
    credentials: true,
  }
));



app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

server.listen(PORT, () => {
  console.log("Server is running on PORT:" + PORT);
  connectDB();
});
