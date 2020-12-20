import { InjectRepository, Service } from "core";
import { User } from "entities/user.entity";
import { Repository } from "typeorm";

@Service()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>
  ) {}
  public async findUsernameOrEmailAndPassword(
    usernameOrEmail: string,
    password: string
  ): Promise<User | undefined> {
    return this.userRepository.findOne({
      relations: ["projects"],
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
    // Email validation
    const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegexp.test(email)) throw "Invalid email address.";

    // username can include only a-zA-Z0-9-
    if (!/^[a-zA-Z0-9_.-]*$/.test(username)) throw "Invalid username";

    // Password validation using regex
    if (
      password.length < 6 ||
      !/^[a-zA-Z0-9_.-]*$/.test(password) ||
      !/\d/.test(password)
    )
      throw "Invalid password";

    return !!this.userRepository.save({ email, username, password });
  }
}
