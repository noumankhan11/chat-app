import express, {
  urlencoded,
  json,
  Request,
  Response,
} from "express";

import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import connectDb from "./db/db.js";
import messageRouter from "./routes/message.routes.js";
import usersRouter from "./routes/users-routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./lib/socket.js";

dotenv.config();
const port = process.env.PORT || 3000;

const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET, POST , PUT ,DELETE, PATCH, HEAD",
  credentials: true,
};

app.use(cors(corsOptions));

app.use(urlencoded({ extended: true }));
app.use(json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRouter);
app.use("/api/users", usersRouter);

app.get("/", (req: Request, res: Response) => {
  console.log(
    "req.headers.authorization:",
    req.headers.authorization
  );
  res.status(200).json({ msg: "Server is up and running" });
});

server.listen(port, async () => {
  await connectDb();
  console.log(`Server is listening at port ${port}`);
});
