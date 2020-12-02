import { Service } from "core";
import { User } from "entities/user.entity";
import { getRepository, Repository } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

@Service()
export class UserService {
  userRepository: Repository<User>;
  constructor() {
    this.userRepository = getRepository(User);
  }

  public async list(): Promise<User[]> {
    return this.userRepository.find();
  }

  public async findUserByName(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: { username },
      relations: ["projects"],
    });
  }

  public async saveUser(user: User) {
    this.userRepository.save(user);
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
