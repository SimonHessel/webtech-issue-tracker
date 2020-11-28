import { User } from "../entities";
import { getRepository, Repository } from "typeorm";
import { Service } from "../core";

@Service()
export class AuthService {
  userRepository: Repository<User> = getRepository(User);
  constructor() {}
  public async findUsernameOrEmailAndPassword(
    usernameOrEmail: string,
    password: string
  ): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: [
        { username: usernameOrEmail, password },
        { email: usernameOrEmail, password },
      ],
    });
  }
}
