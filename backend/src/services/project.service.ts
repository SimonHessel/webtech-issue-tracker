import { InjectRepository, Service } from "core";
import { Project } from "entities/project.entity";
import { UserService } from "services/user.service";
import { Repository } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

@Service()
export class ProjectService {
  constructor(
    private userService: UserService,
    @InjectRepository(Project) private projectRepository: Repository<Project>
  ) {}

  public async findByID(id: number) {
    return this.projectRepository.findOne(id);
  }

  public async createProject(
    title: string,
    description: string,
    username: string
  ): Promise<Project> {
    const user = await this.userService.findUserByName(username);
    if (user) {
      const project = await this.projectRepository.save({
        title,
        description,
        issues: [],
        users: [user],
      });
      user.projects.push(project);
      this.userService.saveUser(user);
      return project;
    } else throw "user is undefinded";
  }

  public async updateProject(
    id: number,
    updatedProject: QueryDeepPartialEntity<Project>
  ): Promise<Project> {
    await this.projectRepository.update(id, updatedProject);
    const project = await this.findByID(id);
    if (project) return project;
    else throw "Internal Server error";
  }

  public async deleteProject(id: number): Promise<boolean> {
    return !!this.projectRepository.delete(id);
  }
}
