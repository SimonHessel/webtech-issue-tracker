import { User } from "entities/user.entity";

export interface Register {
  email: User["email"];
  username: User["username"];
  password: User["password"];
}
