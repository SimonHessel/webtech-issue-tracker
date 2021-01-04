import { Project } from "entities/project.entity";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(Project)
export class ProjectRepository extends Repository<Project> {
  public async selectUsersFromProjectByID(id: number) {
    const project = await this.createQueryBuilder("project")
      .select(["users", "project.id"])
      .where("project.id = :id", { id })
      .leftJoin("project.users", "users")
      .getOneOrFail();
    return project.users;
  }
}
