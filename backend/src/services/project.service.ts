import { Project, User } from "../entities";
import { getRepository, Repository } from "typeorm";
import { Service } from "../core";
import { UserService } from "./user.service";

@Service()
export class ProjectService {
  projectRepository: Repository<Project>;
  constructor(private userService: UserService) {
    this.projectRepository = getRepository(Project);
  }

  public async findByID(id: number) {
    return this.projectRepository.findOne(id);
  }

  public async createProject(
    title: string,
    description: string,
    username: string
  ) {
    const user = await this.userService.findUserByName(username);
    if (user)
      return this.projectRepository.save({
        title,
        description,
        issues: [],
        users: [user],
      });
    else throw "user is undefinded";
  }
}
