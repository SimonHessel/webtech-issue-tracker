import { Issue } from "entities/issue.entity";
import { Project } from "entities/project.entity";
import { EntityRepository, Repository, SelectQueryBuilder } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

@EntityRepository(Issue)
export class IssueRepository extends Repository<Issue> {
  async findLastPostionOfStatus(projectID: Project["id"], status = 0) {
    const issue = await this.createQueryBuilder("issue")
      .select("issue.position")
      .where("issue.projectId = :projectID AND issue.status = :status", {
        projectID,
        status,
      })
      .orderBy("issue.position", "DESC")
      .getOne();

    return issue?.position ?? 0;
  }

  public async findIssuesAndAssigneeUsername(
    id: Issue["id"],
    skip: Parameters<SelectQueryBuilder<Issue>["skip"]>[0],
    take: Parameters<SelectQueryBuilder<Issue>["take"]>[0],
    filter: {
      search?: string;
      assignee?: string;
      status?: Issue["status"];
      priority?: Issue["priority"];
    }
  ) {
    const queryBuilder = this.createQueryBuilder("issue")
      .select(["issue", "assignee.username"])
      .where("issue.projectId = :id", { id });

    const { search, assignee, status, priority } = filter;
    if (search)
      queryBuilder.andWhere("issue.title like :search", {
        search: `%${search}%`,
      });
    if (status !== undefined)
      queryBuilder.andWhere("issue.status = :status", { status });
    if (priority !== undefined)
      queryBuilder.andWhere("issue.priority = :priority", { priority });

    if (assignee)
      queryBuilder.andWhere("assignee.username = :assignee", {
        assignee,
      });

    return queryBuilder
      .orderBy("issue.status", "ASC")
      .addOrderBy("issue.position")
      .skip(skip)
      .take(take)
      .leftJoin("issue.assignee", "assignee")
      .getMany();
  }

  public async updateByIDAndReturn(
    id: Issue["id"],
    issue: QueryDeepPartialEntity<Issue>
  ) {
    const res = await this.createQueryBuilder()
      .update()
      .set(issue)
      .where("issue.id = :id", { id })
      .output(Object.keys(issue))
      .execute();
    return res.raw[0] as Parameters<IssueRepository["update"]>[1];
  }

  async updatePositionOfIssues(
    projectID: Project["id"],
    position: Issue["position"],
    status: Issue["status"]
  ) {
    return this.createQueryBuilder("issue")
      .update()
      .set({
        position: () => "position +1",
      })
      .where(
        'issue.position >= :position AND issue.status = :status AND "issue"."projectId" = :projectID',
        { position, projectID, status }
      )
      .execute();
  }
}
