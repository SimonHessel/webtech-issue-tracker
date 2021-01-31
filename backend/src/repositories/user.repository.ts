import { User } from "entities/user.entity";
import { EntityRepository, In, Repository } from "typeorm";

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

  findByUsernamesOrEmails(usernamesOrEmails: string[]): Promise<User[]> {
    return this.find({
      where: [
        { username: In(usernamesOrEmails) },
        { email: In(usernamesOrEmails) },
      ],
    });
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
      .addSelect("user.isVerified")
      .getOneOrFail();
  }

  findByToken(VerificationToken: string): Promise<User> {
    return this.findOneOrFail({ VerificationToken });
  }
}
