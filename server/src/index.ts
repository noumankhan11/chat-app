import express, {
  urlencoded,
  json,
  Request,
  Response,
} from "express";

import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import connectDb from "./db/db.js";
dotenv.config();
const port = process.env.PORT || 3000;
const app = express();

app.use(urlencoded({ extended: true }));
app.use(json());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ msg: "Server is up and running" });
});

app.use("/api/auth/", authRoutes);

app.listen(port, async () => {
  await connectDb();
  console.log(`Server is listening at port ${port}`);
});
