import { BaseStructure, Injectable, InjectRepository } from "core";
import { User } from "entities/user.entity";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import { UserRepository } from "repositories/user.repository";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class EmailService extends BaseStructure {
  private transport: Mail | undefined;

  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository
  ) {
    super();
    if (process.env.SMTP_USERNAME && process.env.SMTP_PASSWORD) {
      this.transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: process.env.SMTP_USERNAME,
          pass: process.env.SMTP_PASSWORD,
        },
      });
      this.verifySMTP();
    }
  }

  private async verifySMTP() {
    if (!this.transport) return this.error("Transport is not defined.");
    try {
      return this.transport.verify();
    } catch (error) {
      this.error(error);
    }
  }

  private sendMail(options: Mail.Options) {
    if (!this.transport) return this.error("Transport is not defined.");
    try {
      return this.transport.sendMail(options);
    } catch (error) {
      throw "An error occured and email could not be sent";
    }
  }

  public async sendRegisterMail(user: User) {
    const randomToken = uuidv4();
    this.userRepository.update(
      { id: user.id },
      { VerificationToken: randomToken }
    );
    const link = "http://localhost:4200/auth/confirm/" + randomToken;
    const mailOptions = {
      from: '"Issue Tracker " <smtp.mailtrap.io>',
      to: user.email,
      subject: "Welcome to the Issue Tracker",
      html:
        "<p>Hello " +
        user.username +
        "</p></br><p> Thank you for registering. " +
        "To complete the registration process and verify your Account, click on this link:" +
        "</br><a href=" +
        link +
        ">Click here to verify</a></p>",
    };

    return this.sendMail(mailOptions);
  }

  public async sendforgotPasswordMail(user: User) {
    const randomToken = uuidv4();
    this.userRepository.update(
      { id: user.id },
      { VerificationToken: randomToken }
    );
    const link = "http://localhost:4200/auth/passwordreset/" + randomToken;
    const mailOptions: Mail.Options = {
      from: '"Issue Tracker " <smtp.mailtrap.io>',
      to: user.email,
      subject: "Password Recovery",
      html:
        "<p> Hey " +
        user.username +
        ". </p></br> <p> To reset your email please Click on this link:" +
        "</br><a href=" +
        link +
        "></a>Click here to reset Password </p>",
    };

    return this.sendMail(mailOptions);
  }

  public async sendinvitedToAProjectMail(user: User, projectID: number) {
    const link = "http://localhost:4200/projects/" + projectID;
    const mailOptions: Mail.Options = {
      from: '"Issue Tracker " <smtp.mailtrap.io>',
      to: user.email,
      subject: "You have been invited to a Project",
      html:
        "<p>Hey " +
        user.username +
        " you have been invited to a Project. Click on this link to get to it" +
        "</br><a href=" +
        link +
        ">Click here</a></p>",
    };

    return this.sendMail(mailOptions);
  }
}
