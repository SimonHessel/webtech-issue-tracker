import { Injectable, InjectRepository } from "core";
import { Project } from "entities/project.entity";
import { User } from "entities/user.entity";
import { IssueRepository } from "repositories/issue.repository";
import { ProjectRepository } from "repositories/project.repository";
import { UserRepository } from "repositories/user.repository";
import { Like } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    @InjectRepository(ProjectRepository)
    private readonly projectRepository: ProjectRepository,
    @InjectRepository(IssueRepository)
    private readonly issueRepository: IssueRepository
  ) {}

  public async findByID(id: number) {
    return this.projectRepository.findOne(id, { relations: ["users"] });
  }

  public async listUsersByProjectID(id: number): Promise<User[]> {
    return this.projectRepository.selectUsersFromProjectByID(id);
  }

  public async findByIDs(
    ids: number[],
    skip: number,
    take: number,
    search?: string
  ): Promise<Project[]> {
    return this.projectRepository.findByIds(ids, {
      where: search
        ? {
            title: Like(`%${search}%`),
          }
        : undefined,
      skip,
      take,
    });
  }

  public async createProject(
    title: string,
    description: string,
    username: string
  ): Promise<Project> {
    try {
      const user = await this.userRepository.findByUsername(username);
      const project = await this.projectRepository.save({
        title,
        description,
        issues: [],
        users: [user],
      });
      user.projects.push(project);
      this.userRepository.save(user);
      return project;
    } catch (error) {
      throw "User is not defined.";
    }
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
