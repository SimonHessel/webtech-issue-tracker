import { RefreshTokenData } from "interfaces/refreshTokenData.interface";
import { TokenData } from "interfaces/tokenData.interface";
import jwt from "jsonwebtoken";

export const verifyJWT = <T extends TokenData | RefreshTokenData>(
  token: string
): Promise<T> =>
  new Promise((resolve, reject) =>
    jwt.verify(
      token,
      process.env.JWT_SECRET,
      {
        algorithms: ["HS256"],
      },
      (err, data) => {
        if (err || !data) return reject(err);
        const { exp: _, ...tokenData } = data as (
          | TokenData
          | RefreshTokenData
        ) & { exp: number };
        resolve(tokenData as T);
      }
    )
  );

const isAccessToken = (
  payload: TokenData | RefreshTokenData
): payload is TokenData => (payload as TokenData).email !== undefined;

export const signJWT = (payload: TokenData | RefreshTokenData): string =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: isAccessToken(payload)
      ? process.env.ACCESS_TOKEN_EXPIRATION
      : process.env.REFRESH_TOKEN_EXPIRATION,
  });
