import { NextFunction, Request, Response } from "express";
import { IMiddleware, Middleware, Options, Service } from "../core";
import { verifyJWT } from "../utils";

@Service()
export class JWTMiddleware implements IMiddleware {
  constructor() {}
  async middleware(
    req: Request<{ projectID: string }, unknown, unknown>,
    res: Response,
    next: NextFunction
  ) {
    const { authorization } = req.headers;
    if (!authorization)
      return res.status(403).send("No authorization header was set.");

    const [type, token] = authorization.split(" ");
    if (!type || !token || type !== "Bearer")
      return res.status(403).send("Authorization header is formated wrong.");

    try {
      const tokenData = await verifyJWT(token);
      if (!tokenData.email || !tokenData.projects || !tokenData.username)
        return res.status(403).send("JWT not matching signature.");

      res.locals.tokenData = tokenData;
      next();
    } catch (err) {
      res.status(403).send(err);
    }
  }
}

export const JWT = (options?: Options) =>
  Middleware<JWTMiddleware>(JWTMiddleware, options);
