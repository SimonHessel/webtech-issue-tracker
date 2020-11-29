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

  public async registerUser(
    email: string,
    username: string,
    password: string
  ): Promise<boolean> {
    const user = new User();
    user.email = email;
    user.username = username;
    user.password = password;

    // Email validation
    const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegexp.test(email)) throw "Test";

    // Needs username validation using regex
    // username can include only a-zA-Z0-9-

    // Needs password validation using regex
    // min. 6 characters, must include at least one number and at least one capital letter

    return !!this.userRepository.save(user);
  }
}
