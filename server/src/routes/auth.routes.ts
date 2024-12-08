import express, { NextFunction, Response, Request } from "express";
import {
  checkAuth,
  login,
  logout,
  register,
  updateFullname,
  updateProfilePic,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/multerMiddleware.js";

const router = express.Router();

router.post("/register", upload.single("profilePic"), register);
router.post("/login", login);
router.post("/logout", logout);
router.put(
  "/update-profile-image",
  upload.single("profilePic"),
  authMiddleware,
  updateProfilePic
);
router.put("/update-fullname", authMiddleware, updateFullname);
router.get("/check", authMiddleware, checkAuth);

export default router;
