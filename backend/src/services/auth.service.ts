import { User } from "entities/user.entity";
import { getRepository, Repository } from "typeorm";
import { Service } from "core";
import * as bcrypt from "bcrypt";

@Service()
export class AuthService {
  userRepository: Repository<User> = getRepository(User);
  constructor() {}
  public async findUsernameOrEmailAndPassword(
    usernameOrEmail: string,
    password: string
  ): Promise<User | undefined> {
    const user = await this.userRepository.findOne({
      relations: ["projects"],
      where: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });
    if (!user) throw "No user found";
    if (await bcrypt.compare(password, user.password)) return user;
  }

  public async registerUser(
    email: string,
    username: string,
    password: string
  ): Promise<User> {
    // Email validation
    const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegexp.test(email)) throw "Invalid email address.";

    // username can include only a-zA-Z0-9-
    if (!/^[a-zA-Z0-9_.-]*$/.test(username)) throw "Invalid username";

    // Password validation using regex
    if (
      password.length < 6 ||
      !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/.test(password)
    )
      throw "Invalid password";

    // Check if user already exists
    if (
      await this.userRepository.findOne({
        relations: ["projects"],
        where: [{ username: username }, { email: email }],
      })
    )
      throw "User already registered";

    // Try to add user to database
    try {
      const hash = await bcrypt.hash(password, 10);
      return this.userRepository.save({ email, username, hash });
    } catch (error) {
      throw "Couldn't register user - hashing error";
    }
  }
}
