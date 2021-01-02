import { Injectable, InjectRepository } from "core";
import { User } from "entities/user.entity";
import { UserRepository } from "repositories/user.repository";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository
  ) {}

  public async list(): Promise<User[]> {
    return this.userRepository.find();
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
