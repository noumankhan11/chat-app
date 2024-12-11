import e from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { getUsers } from "../controllers/users.controller.js";

const router = e.Router();

router.get("/all-users", authMiddleware, getUsers);

export default router;
