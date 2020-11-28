import { verifyJWT } from "../utils";
import { ControllerMiddleware, IMiddleware } from "../core";

export const JWTMiddleware: IMiddleware = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization)
    return res.status(403).send("No authorization header was set.");

  const [type, token] = authorization.split(" ");
  if (!type || !token || type !== "Bearer")
    return res.status(403).send("Authorization header is formated wrong.");

  try {
    res.locals.tokenData = await verifyJWT(token);
    next();
  } catch (err) {
    res.status(403).send(err);
  }
};
export const JWT = ControllerMiddleware(JWTMiddleware);
