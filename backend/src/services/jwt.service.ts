import { Injectable, InjectRepository } from "core";
import { User } from "entities/user.entity";
import { Response } from "express";
import { RefreshTokenData } from "interfaces/refreshTokenData.interface";
import { TokenDataDTO } from "interfaces/tokenData.dto";
import { TokenData } from "interfaces/tokenData.interface";
import { UserRepository } from "repositories/user.repository";
import { signJWT, verifyJWT } from "utils/jwt.util";

@Injectable()
export class JWTService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository
  ) {}

  public async checkRefreshToken(token: string): Promise<User> {
    try {
      const { version, username } = await verifyJWT<RefreshTokenData>(token);

      const user = await this.userRepository.findByUsername(username);
      if (!!user && user.passwordVersion === version) return user;
      else throw "Password has been reset.";
    } catch (error) {
      throw "Refreshtoken not valid or user not found.";
    }
  }

  public async setRefreshToken(res: Response, user: User) {
    const token = signJWT({
      username: user.username,
      version: user.passwordVersion,
    });
    res.cookie(process.env.RFRESH_TOKEN_COKKIE_NAME, token, {
      httpOnly: true,
      secure: false,
      path: "/api/auth/refresh",
    });
  }

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
    res.setHeader(process.env.ACCESS_TOKEN_HEADER_NAME, token);
    return true;
  }
}
