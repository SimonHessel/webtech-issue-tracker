import { Request, Response } from "express";

export type IMiddleware = (req: Request, resp: Response, next: Function) => any;
