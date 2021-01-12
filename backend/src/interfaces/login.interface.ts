import { User } from "entities/user.entity";

export interface Login {
  usernameOrEmail: string;
  password: User["password"];
}
