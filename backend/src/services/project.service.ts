import { BaseStructure, Injectable, InjectRepository } from "core";
import { Project } from "entities/project.entity";
import { User } from "entities/user.entity";
import { IssueRepository } from "repositories/issue.repository";
import { ProjectRepository } from "repositories/project.repository";
import { UserRepository } from "repositories/user.repository";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

type ProjectAndCount = Omit<Project, "issues" | "users"> & {
  issueAmount: number[];
};
@Injectable()
export class ProjectService extends BaseStructure {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    @InjectRepository(ProjectRepository)
    private readonly projectRepository: ProjectRepository,
    @InjectRepository(IssueRepository)
    private readonly issueRepository: IssueRepository
  ) {
    super();
  }

  public async findByID(id: Project["id"]) {
    return this.projectRepository.findOne(id, { relations: ["users"] });
  }

  public async listUsersByProjectID(id: Project["id"]): Promise<User[]> {
    return this.projectRepository.selectUsersFromProjectByID(id);
  }

  public async findByIDs(
    ids: Project["id"][],
    skip: number,
    take: number,
    search?: string
  ) {
    const rawProjects = await this.projectRepository.findRawProjectsBySearchAndIDs(
      ids,
      skip,
      take,
      search
    );
    const projects: ProjectAndCount[] = [];

    for (const { description, title, id, ...project } of rawProjects) {
      if (projects.length > 0 && projects[projects.length - 1].id === id) {
        projects[projects.length - 1].issueAmount[
          project.issue_status
        ] = parseInt(project.issue_amount, 10);
      } else {
        const states = project.states.split(",");
        projects.push({
          description,
          id,
          states,
          title,
          issueAmount: new Array(states.length).fill(0),
        });
        projects[projects.length - 1].issueAmount[
          project.issue_status
        ] = parseInt(project.issue_amount, 10);
      }
    }
    return projects;
  }

  public async createProject(
    title: string,
    description: string,
    usernames: string[]
  ): Promise<ProjectAndCount> {
    try {
      const users = await this.userRepository.findByUsernames(usernames);
      const project = await this.projectRepository.save({
        title,
        description,
        issues: [],
        users,
      });

      return {
        ...project,
        issueAmount: new Array(project.states.length).fill(0),
      };
    } catch (error) {
      this.error(error);
      throw "User is not defined.";
    }
  }

  public async updateProject(
    id: Project["id"],
    updatedProject: QueryDeepPartialEntity<Project>
  ): Promise<Project> {
    await this.projectRepository.update(id, updatedProject);
    const project = await this.findByID(id);
    if (project) return project;
    else throw "Internal Server error";
  }

  public async deleteProject(id: Project["id"]): Promise<boolean> {
    return !!this.projectRepository.delete(id);
  }
}
