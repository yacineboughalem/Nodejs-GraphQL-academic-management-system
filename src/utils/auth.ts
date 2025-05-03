import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const generateToken = (payload: any): string => {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "7d" });
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, process.env.JWT_SECRET!);
};
