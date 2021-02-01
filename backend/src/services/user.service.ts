import { BaseStructure, Injectable, InjectRepository } from "core";
import { User } from "entities/user.entity";
import { UserRepository } from "repositories/user.repository";
import { Like } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

@Injectable()
export class UserService extends BaseStructure {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository
  ) {
    super();
  }

  public async findUsers(
    search: string
  ): Promise<Pick<User, "username" | "email">[]> {
    return this.userRepository.find({
      where: [
        { username: Like(`%${search}%`) },
        { email: Like(`%${search}%`) },
      ],
      select: ["username", "email"],
      take: 10,
    });
  }

  public async findByUsername(username: string): Promise<User> {
    return this.userRepository.findByUsername(username);
  }

  public async updateUser(
    username: string,
    updatedUser: QueryDeepPartialEntity<User>
  ): Promise<User> {
    await this.userRepository.update({ username }, updatedUser);
    const user = await this.userRepository.findOne({ username });
    if (user) return user;
    else throw "Internal Server error";
  }

  public async deleteUserByUsername(username: string): Promise<boolean> {
    return !!this.userRepository.delete({ username });
  }
}
