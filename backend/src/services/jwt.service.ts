import { InjectRepository, Service } from "core";
import { User } from "entities/user.entity";
import { Response } from "express";
import { RefreshTokenData } from "interfaces/refreshTokenData.interface";
import { TokenDataDTO } from "interfaces/tokenData.dto";
import { TokenData } from "interfaces/tokenData.interface";
import { Repository } from "typeorm";
import { signJWT, verifyJWT } from "utils/jwt.util";

@Service()
export class JWTService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>
  ) {}

  public async checkRefreshToken(token: string): Promise<User> {
    try {
      const { version, username } = await verifyJWT<RefreshTokenData>(token);
      const user = await this.userRepository.findOne(
        { username },
        { relations: ["projects"] }
      );

      if (!!user && user.passwordVersion === version) return user;
      else throw "Password has been reset.";
    } catch (error) {
      throw "Refreshtoken not valid.";
    }
  }

  public async setRefreshToken(res: Response, username: string) {
    const user = await this.userRepository.findOne({ username });

    if (!user) throw "User does not exists.";

    const token = signJWT({ username, version: user.passwordVersion });
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
