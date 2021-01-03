import { Injectable, InjectRepository } from "core";
import { Issue } from "entities/issue.entity";
import { IssueDTO } from "interfaces/Issue.dto";
import { IssueRepository } from "repositories/issue.repository";
import { ProjectRepository } from "repositories/project.repository";
import { UserRepository } from "repositories/user.repository";

@Injectable()
export class IssueService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    @InjectRepository(ProjectRepository)
    private readonly projectRepository: ProjectRepository,
    @InjectRepository(IssueRepository)
    private readonly issueRepository: IssueRepository
  ) {}

  async getProjectIssues(
    id: number,
    skip: number,
    take: number
  ): Promise<Issue[]> {
    return this.issueRepository.find({
      where: { project: { id } },
      skip,
      take,
    });
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
      throw "User or Project is not defined.";
    }
  }
}
