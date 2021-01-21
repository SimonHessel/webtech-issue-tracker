import { User } from "entities/user.entity";

export interface RefreshTokenData {
  username: User["username"];
  version: User["passwordVersion"];
}
