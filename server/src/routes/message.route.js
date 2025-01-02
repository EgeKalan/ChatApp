import express from "express";
import {protectRoute} from "../middleware/auth.middleware.js"; 
import { getUsersForSidebar, sendImage, getMessages } from "../controllers/message.controller.js";
 
const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);

router.post("/upload/:id", protectRoute,  sendImage);
export default router;