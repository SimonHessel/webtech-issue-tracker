import { signJWT } from "../utils";
import { Service } from "../core";
import { TokenData, TokenDataDTO } from "../interfaces";
import { Response } from "express";
@Service()
export class JWTService {
  constructor() {}

  public updateToken(
    res: Response,
    newData: TokenDataDTO,
    oldData?: TokenData
  ): boolean {
    const tokenData: TokenData = { ...oldData, ...newData } as TokenData;
    if (!tokenData.email || !tokenData.projects || !tokenData.username)
      return false;
    const token = signJWT(tokenData);
    res.locals.tokenData = tokenData;
    res.setHeader("Token", token);
    return true;
  }
}
