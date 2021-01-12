import { NextFunction, Request, Response } from "express";
import {
  IMiddleware,
  Middleware,
  Options,
  Injectable,
  BaseStructure,
} from "core";
import { verifyJWT } from "utils/jwt.util";
import { TokenData } from "interfaces/tokenData.interface";

@Injectable()
export class JWTMiddleware extends BaseStructure implements IMiddleware {
  constructor() {
    super();
  }
  async middleware(
    req: Request<unknown, unknown, unknown>,
    res: Response,
    next: NextFunction
  ) {
    const { authorization } = req.headers;
    if (!authorization)
      return res.status(401).send("No authorization header was set.");

    const [type, token] = authorization.split(" ");
    if (!type || !token || type !== "Bearer")
      return res.status(401).send("Authorization header is formated wrong.");

    try {
      const tokenData = await verifyJWT<TokenData>(token);
      if (!tokenData.email || !tokenData.projects || !tokenData.username)
        return res.status(401).send("JWT not matching signature.");

      res.locals.tokenData = tokenData;
      next();
    } catch (err) {
      this.error(err);
      res.status(401).send(err);
    }
  }
}

export const JWT = (options?: Options) =>
  Middleware<JWTMiddleware>(JWTMiddleware, options);
