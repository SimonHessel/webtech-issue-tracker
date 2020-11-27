import { IMiddleware } from "core";

export const loggerMiddleware: IMiddleware = (req, res, next) => {
  console.log("Request logged:", req.method, req.path);
  next();
};
