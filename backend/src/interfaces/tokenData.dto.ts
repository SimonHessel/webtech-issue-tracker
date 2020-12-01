import { TokenData } from "interfaces/tokenData.interface";

export interface TokenDataDTO {
  projects?: TokenData["projects"];
  username?: TokenData["username"];
  email?: TokenData["email"];
}
