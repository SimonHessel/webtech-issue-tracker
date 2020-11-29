import { NextFunction, Request, Response } from "express";

export interface IMiddleware {
  middleware(
    req: Request<any, any, any>,
    resp: Response<any>,
    next: NextFunction
  ): any;
}
