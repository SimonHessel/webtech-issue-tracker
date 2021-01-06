import bcrypt from "bcrypt";
import { BaseStructure, Injectable, InjectRepository } from "core";
import { User } from "entities/user.entity";
import { UserRepository } from "repositories/user.repository";

@Injectable()
export class AuthService extends BaseStructure {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository
  ) {
    super();
  }
  public async findbyUsernameOrEmailAndPassword(
    usernameOrEmail: string,
    password: string
  ): Promise<User> {
    try {
      const user = await this.userRepository.findByUsernameOrEmail(
        usernameOrEmail
      );

      if (await bcrypt.compare(password, user.password)) return user;
      else throw "Wrong password or username.";
    } catch (error) {
      this.error(error);
      throw "No user found";
    }
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
      !/^[a-zA-Z0-9_.-]*$/.test(password) ||
      !/\d/.test(password)
    )
      throw "Invalid password";

    try {
      const hash = await bcrypt.hash(password, 10);
      return this.userRepository.save({ email, username, password: hash });
    } catch (error) {
      this.error(error);
      throw "Couldn't register user - hashing error";
    }
  }
}
