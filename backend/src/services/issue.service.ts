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

  async moveIssue(
    projectID: Project["id"],
    id: Issue["id"],
    position: Issue["position"],
    status: Issue["status"]
  ) {
    this.issueRepository
      .createQueryBuilder("issue")
      .update()
      .set({
        position: () => "position +1",
      })
      .where(
        'issue.position >= :position AND issue.status = :status AND "issue"."projectId" = :projectID',
        { position, projectID, status }
      )
      .execute();

    return this.issueRepository.update(id, {
      position,
      status,
    });
  }

  async updateIssue(
    id: Issue["id"],
    issue: Parameters<IssueRepository["update"]>[1]
  ) {
    const res = await this.issueRepository
      .createQueryBuilder()
      .update()
      .set(issue)
      .where("issue.id = :id", { id })
      .output(Object.keys(issue))
      .execute();
    return res.raw[0] as Parameters<IssueRepository["update"]>[1];
  }

  async getProjectIssues(
    id: Issue["id"],
    skip: number,
    take: number
  ): Promise<Issue[]> {
    return this.issueRepository
      .createQueryBuilder("issue")
      .select(["issue", "assignee.username"])
      .where("issue.projectId = :id", { id })
      .orderBy("issue.status", "ASC")
      .addOrderBy("issue.position")
      .skip(skip)
      .take(take)
      .leftJoin("issue.assignee", "assignee")

      .getMany();
  }

  async getIssueByID(id: Issue["id"]) {
    return this.issueRepository.findOneOrFail(id, { relations: ["project"] });
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
