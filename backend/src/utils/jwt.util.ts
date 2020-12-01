import { TokenData } from "interfaces/tokenData.interface";
import * as jwt from "jsonwebtoken";

export const verifyJWT = (token: string): Promise<TokenData> =>
  new Promise((resolve, reject) =>
    jwt.verify(token, process.env.JWT_SECRET || "secret", (err, data) => {
      if (err || !data) return reject(err);
      resolve(data as TokenData);
    })
  );
export const signJWT = (payload: TokenData): string =>
  jwt.sign(payload, process.env.JWT_SECRET || "secret");
