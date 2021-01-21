/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";

export interface IMiddleware {
  /**
   * Express middleware function
   */
  middleware(
    req: Request<any, any, any>,
    resp: Response<any>,
    next: NextFunction
  ): any;
}
