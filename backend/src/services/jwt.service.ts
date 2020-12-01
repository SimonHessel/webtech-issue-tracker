import { Service } from "core";
import { Response } from "express";
import { TokenDataDTO } from "interfaces/tokenData.dto";
import { TokenData } from "interfaces/tokenData.interface";
import { signJWT } from "utils/jwt.util";

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
