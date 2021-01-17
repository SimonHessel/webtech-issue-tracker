import { Issue } from "entities/issue.entity";
import { Project } from "entities/project.entity";
import { EntityRepository, Repository } from "typeorm";

interface RawProject {
  description: Project["description"];
  issue_status: Issue["status"];
  issue_project_id: Project["id"];
  issue_amount: string;
  id: Project["id"];
  title: Project["title"];
  states: string;
}

@EntityRepository(Project)
export class ProjectRepository extends Repository<Project> {
  public async selectUsersFromProjectByID(id: Project["id"]) {
    const project = await this.createQueryBuilder("project")
      .select(["users", "project.id"])
      .where("project.id = :id", { id })
      .leftJoin("project.users", "users")
      .getOneOrFail();
    return project.users;
  }

  public async findRawProjectsBySearchAndIDs(
    ids: Project["id"][],
    skip: number,
    take: number,
    search?: string
  ) {
    const queryBuilder = this.createQueryBuilder("project")
      .select([
        "project.id as id",
        "project.title as title",
        "project.description as description",
        "project.states as states",
      ])
      .whereInIds(ids)
      .orderBy("project.id");

    if (search)
      queryBuilder.andWhere("project.title like :search", {
        search: `%${search}%`,
      });

    return queryBuilder
      .leftJoinAndSelect(
        (qb) =>
          qb
            .select([
              "issue.projectId as issue_project_id",
              "issue.status",
              "COUNT(*) as issue_amount",
            ])
            .from(Issue, "issue")
            .groupBy("issue.status, issue.projectId"),

        "issues",
        "issue_project_id = project.id" // the answer
      )
      .addOrderBy("issue_status")
      .skip(skip)
      .take(take)
      .printSql()
      .getRawMany() as Promise<RawProject[]>;
  }
}
