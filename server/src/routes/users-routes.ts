import e from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { getUsers } from "../controllers/users.controller.js";

const router = e.Router();

router.get("/users", authMiddleware, getUsers);

export default router;
