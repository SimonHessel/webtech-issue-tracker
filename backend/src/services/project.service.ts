import { BaseStructure, Injectable, InjectRepository } from "core";
import { Issue } from "entities/issue.entity";
import { Project } from "entities/project.entity";
import { User } from "entities/user.entity";
import { IssueRepository } from "repositories/issue.repository";
import { ProjectRepository } from "repositories/project.repository";
import { UserRepository } from "repositories/user.repository";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

interface RawProject {
  description: Project["description"];
  issue_status: Issue["status"];
  issue_project_id: Project["id"];
  issue_amount: string;
  id: Project["id"];
  title: Project["title"];
  states: string;
}

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
  ) {
    let query = this.projectRepository
      .createQueryBuilder("project")
      .select([
        "project.id as id",
        "project.title as title",
        "project.description as description",
        "project.states as states",
      ])
      .whereInIds(ids)
      .orderBy("project.id");

    if (search)
      query = query.andWhere("project.title like :search", {
        search: `%${search}%`,
      });

    const res: RawProject[] = await query
      .leftJoinAndSelect(
        (qb) =>
          qb
            .select([
              "issue.projectId as issue_project_id",
              "issue.status",
              "COUNT(*) as issue_amount",
            ])
            .from(Issue, "issue")
            .groupBy("issue.status, issue.projectId")
            .orderBy("issue.status"),

        "issues",
        "issue_project_id = project.id" // the answer
      )
      .skip(skip)
      .take(take)
      .getRawMany();

    const projects: ProjectAndCount[] = [];

    for (const { description, title, id, ...project } of res) {
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
      }
    }
    return projects;
  }

  public async createProject(
    title: string,
    description: string,
    usernames: string[]
  ): Promise<Project> {
    try {
      const users = await this.userRepository.findByUsernames(usernames);
      return this.projectRepository.save({
        title,
        description,
        issues: [],
        users,
      });
    } catch (error) {
      this.error(error);
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
