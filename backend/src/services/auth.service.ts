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
      throw typeof error === "string" ? error : "No user found";
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

      await this.emailService.sendRegisterMail(user);
      return user;
    } catch (error) {
      this.error(error);
      throw "Couldn't register user.";
    }
  }

  public async sendPasswordRecoveryEmail(email: string) {
    const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegexp.test(email)) throw "Invalid email address.";

    try {
      const user = await this.userRepository.findByUsernameOrEmail(email);
      await this.emailService.sendforgotPasswordMail(user);
    } catch {
      throw "Could not fetch user with that username/email.";
    }
  }

  public async recoverPassword(token: string, newPassword: string) {
    try {
      const user = await this.userRepository.findByToken(token);

      if (
        newPassword.length < 6 ||
        !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/.test(newPassword)
      )
        throw "Invalid password";

      if (!user.isVerified)
        throw "User needs to verify email first before attempting to reset password.";
      this.userRepository.update(
        { id: user.id },
        {
          password: await bcrypt.hash(newPassword, 10),
          passwordVersion: user.passwordVersion + 1,
        }
      );
    } catch {
      throw "Could not update password.";
    }
  }

  public async confirmEmail(token: string) {
    try {
      const user = await this.userRepository.findByToken(token);

      this.userRepository.update({ id: user.id }, { isVerified: true });
    } catch {
      throw "No user with specified token has been found.";
    }
  }
}
