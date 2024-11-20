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
import cookieParser from "cookie-parser";

dotenv.config();
const port = process.env.PORT || 3000;
const app = express();

app.use(urlencoded({ extended: true }));
app.use(json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRouter);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ msg: "Server is up and running" });
});

app.listen(port, async () => {
  await connectDb();
  console.log(`Server is listening at port ${port}`);
});
