import express from "express";
import { sendMessage } from "../controllers/sendMessage.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/send/:id", authMiddleware, sendMessage);

export default router;
