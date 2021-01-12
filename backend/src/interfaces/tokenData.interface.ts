import { Project } from "entities/project.entity";
import { User } from "entities/user.entity";

export interface TokenData {
  projects: Project["id"][];
  username: User["username"];
  email: User["email"];
  iat: number;
}
