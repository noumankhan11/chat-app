import { Response } from "express";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongoose";

export const generateTokenAndSetCookie = (
  userId: ObjectId,
  res: Response
) => {
  const token = jwt.sign(
    { userId },
    process.env.SECRET_KEY as string,
    {
      expiresIn: "15d",
    }
  );

  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 15 * 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
  });
};
