import { signJWT } from "../utils";
import { Service } from "../core";
import { TokenData } from "../interfaces";
@Service()
export class JWTService {
  constructor() {}

  public updateToken(newData: TokenData, oldData?: TokenData): string {
    return signJWT({ ...oldData, ...newData });
  }
}
