import { NextFunction, Request, Response } from "express";

export type IMiddleware = (
  req: Request<any, any, any>,
  resp: Response<any>,
  next: NextFunction
) => any;
