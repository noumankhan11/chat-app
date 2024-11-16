import { Request, Response } from "express";

export const register = async (req: Request, res: Response) => {
  console.log("Register route");
};
export const login = async (req: Request, res: Response) => {
  console.log("login route");
};
export const logout = async (req: Request, res: Response) => {
  console.log("logout route");
};
