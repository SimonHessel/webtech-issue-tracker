import { User } from "entities/user.entity";

export interface UserDTO {
  username: User["username"];
  email: User["email"];
  password?: User["password"];
}
