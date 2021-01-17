import { BaseStructure, Injectable, InjectRepository } from "core";
import { Issue } from "entities/issue.entity";
import { Project } from "entities/project.entity";
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

  async updateIssueStatusAndOrder(
    projectID: Project["id"],
    id: Issue["id"],
    position: Issue["position"],
    status: Issue["status"]
  ) {
    try {
      this.issueRepository.updatePositionOfIssues(projectID, position, status);

      this.issueRepository.update(id, {
        position,
        status,
      });
    } catch (error) {
      this.error(error);
      throw "Issue could not be moved.";
    }
  }

  async updateIssue(
    id: Issue["id"],
    issue: Parameters<IssueRepository["updateByIDAndReturn"]>[1]
  ) {
    return this.issueRepository.updateByIDAndReturn(id, issue);
  }

  async getProjectIssues(
    id: Issue["id"],
    skip: number,
    take: number,
    filter: Parameters<IssueRepository["findIssuesAndAssigneeUsername"]>[3]
  ): Promise<Issue[]> {
    return this.issueRepository.findIssuesAndAssigneeUsername(
      id,
      skip,
      take,
      filter
    );
  }

  async getIssueByID(id: Issue["id"]) {
    return this.issueRepository.findOneOrFail(id, {
      relations: ["project", "project.users"],
    });
  }

  async createProjectIssue(
    projectID: Project["id"],

    { assignee, ...issue }: IssueDTO
  ): Promise<Issue> {
    try {
      const [user, project, lastPostion] = await Promise.all([
        this.userRepository.findByUsername(assignee),
        this.projectRepository.findOneOrFail(projectID),
        this.issueRepository.findLastPostionOfStatus(projectID, issue.status),
      ]);

      return this.issueRepository.save({
        ...issue,
        assignee: user,
        project,
        position: lastPostion + 1,
      });
    } catch (error) {
      this.error(error);
      throw "User or Project is not defined.";
    }
  }
}
