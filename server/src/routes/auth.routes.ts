import express, { NextFunction, Response, Request } from "express";
import {
  checkAuth,
  login,
  logout,
  register,
  updateProfile,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/multerMiddleware.js";

const router = express.Router();

router.post("/register", upload.single("profilePic"), register);
router.post("/login", login);
router.post("/logout", logout);
router.put("/update-profile", authMiddleware, updateProfile);
router.get("/check", authMiddleware, checkAuth);

export default router;
