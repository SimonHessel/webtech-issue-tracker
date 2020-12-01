import { Service } from "core";
import { User } from "entities/user.entity";
import { getRepository, Repository } from "typeorm";

@Service()
export class UserService {
  userRepository: Repository<User>;
  constructor() {
    this.userRepository = getRepository(User);
  }

  public async findUserByName(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: { username },
    });
  }
}
