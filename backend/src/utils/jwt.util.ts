import { RefreshTokenData } from "interfaces/refreshTokenData.interface";
import { TokenData } from "interfaces/tokenData.interface";
import * as jwt from "jsonwebtoken";

export const verifyJWT = <T>(token: string): Promise<T> =>
  new Promise((resolve, reject) =>
    jwt.verify(token, process.env.JWT_SECRET || "secret", (err, data) => {
      if (err || !data) return reject(err);
      // eslint-disable-next-line unused-imports/no-unused-vars-ts
      const { exp, ...tokenData } = data as any;
      resolve(tokenData as T);
    })
  );

const isAccessToken = (
  payload: TokenData | RefreshTokenData
): payload is TokenData => (payload as TokenData).email !== undefined;

export const signJWT = (payload: TokenData | RefreshTokenData): string =>
  jwt.sign(payload, process.env.JWT_SECRET || "secret", {
    expiresIn: isAccessToken(payload)
      ? process.env.ACCESS_TOKEN_EXPIRATION
      : process.env.REFRESH_TOKEN_EXPIRATION,
  });
