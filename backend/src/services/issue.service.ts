import { InjectRepository, Injectable } from "core";
import { Issue } from "entities/issue.entity";
import { IssueDTO } from "interfaces/Issue.dto";
import { ProjectService } from "services/project.service";
import { UserService } from "services/user.service";
import { Repository } from "typeorm";

@Injectable()
export class IssueService {
  constructor(
    @InjectRepository(Issue) private issueRepository: Repository<Issue>,
    private readonly userService: UserService,
    private readonly projectService: ProjectService
  ) {}

  async getProjectIssues(id: number): Promise<Issue[]> {
    return this.issueRepository.find({ where: { project: { id } } });
  }

  async createProjectIssue(
    projectID: number,

    { assignee, ...issue }: IssueDTO
  ): Promise<Issue> {
    const [user, project] = await Promise.all([
      this.userService.findUserByName(assignee),
      this.projectService.findByID(projectID),
    ]);

    if (!user || !project) throw "User or Project is not defined.";
    return this.issueRepository.save({
      ...issue,
      assignee: user,
      project,
    });
  }
}
