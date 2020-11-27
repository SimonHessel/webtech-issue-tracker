import { User } from "../entities";
import { getRepository, Repository } from "typeorm";
import { Service } from "../core";

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
