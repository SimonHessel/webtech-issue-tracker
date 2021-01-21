import { Project } from "entities/project.entity";
import { User } from "entities/user.entity";

export interface ProjectDTO {
  title: Project["title"];
  description: Project["description"];
  users: User["username"][];
}
