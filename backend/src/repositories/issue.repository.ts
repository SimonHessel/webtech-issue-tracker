import { Issue } from "entities/issue.entity";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(Issue)
export class IssueRepository extends Repository<Issue> {
  async findLastPostionOfStatus(projectID: number, status = 0) {
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
}
