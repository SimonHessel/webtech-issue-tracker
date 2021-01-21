import bcrypt from "bcrypt";
import { BaseStructure, Injectable, InjectRepository } from "core";
import { User } from "entities/user.entity";
import { UserRepository } from "repositories/user.repository";
import { EmailService } from "services/email.service";

@Injectable()
export class AuthService extends BaseStructure {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly emailService: EmailService
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
      const user = await this.userRepository.save({
        email,
        username,
        password: hash,
      });

      // await this.emailService.sendRegisterMail(user);
      return user;
    } catch (error) {
      this.error(error);
      throw "Couldn't register user.";
    }
  }
}
