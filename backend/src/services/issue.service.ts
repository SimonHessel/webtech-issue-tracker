import { BaseStructure, Injectable, InjectRepository } from "core";
import { Issue } from "entities/issue.entity";
import { IssueDTO } from "interfaces/Issue.dto";
import { IssueRepository } from "repositories/issue.repository";
import { ProjectRepository } from "repositories/project.repository";
import { UserRepository } from "repositories/user.repository";

@Injectable()
export class IssueService extends BaseStructure {
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

  async getProjectIssues(
    id: number,
    skip: number,
    take: number
  ): Promise<Issue[]> {
    return this.issueRepository
      .createQueryBuilder("issue")
      .select(["issue", "assignee.username"])
      .where("issue.projectId = :id", { id })
      .orderBy("issue.status", "ASC")
      .skip(skip)
      .take(take)
      .leftJoin("issue.assignee", "assignee")

      .getMany();
  }

  async createProjectIssue(
    projectID: number,

    { assignee, ...issue }: IssueDTO
  ): Promise<Issue> {
    try {
      const [user, project] = await Promise.all([
        this.userRepository.findByUsername(assignee),
        this.projectRepository.findOneOrFail(projectID),
      ]);

      return this.issueRepository.save({
        ...issue,
        assignee: user,
        project,
      });
    } catch (error) {
      this.error(error);
      throw "User or Project is not defined.";
    }
  }
}
