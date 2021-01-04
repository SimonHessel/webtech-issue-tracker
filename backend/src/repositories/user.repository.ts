import { User } from "entities/user.entity";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  findByUsername(username: string, withProjects = true): Promise<User> {
    return this.findOneOrFail(
      {
        username,
      },
      withProjects ? { relations: ["projects"] } : undefined
    );
  }

  findByUsernameOrEmail(
    usernameOrEmail: string,
    withProjects = true
  ): Promise<User> {
    let queryBuilder = this.createQueryBuilder("user");

    if (withProjects)
      queryBuilder = queryBuilder.leftJoinAndSelect("user.projects", "project");

    return queryBuilder
      .where(
        "user.username = :usernameOrEmail OR user.email = :usernameOrEmail",
        { usernameOrEmail }
      )
      .addSelect("user.password")
      .getOneOrFail();
  }
}
