import { Request, Response } from "express";

export const loggerMiddleware = (
  req: Request,
  res: Response,
  next: Function
) => {
  console.log("Request logged:", req.method, req.path);
  next();
};
