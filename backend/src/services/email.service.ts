import { InjectRepository, Injectable } from "core";
import nodemailer from "nodemailer";
import { Repository } from "typeorm";
import { User } from "entities/user.entity";
import { UserService } from "services/user.service";

@Injectable()
export class EmailService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly userService: UserService
  ) { }

  private transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "webtechtestnodemailer@gmail.com",
      pass: "webtech2020",
    },
  });
  // welcome new user and ask to verify email
  public async sendRegisterMail(username: string) {
    const user = await this.userService.findUserByName(username);

    const mailOptions = {
      from: '"Issue Tracker " <webtechtestnodemailer@gmail.com>',
      to: user?.email,
      subject: "Welcome to the Issue Tracker",
      html: "<h1>Hello"+username+"</h1></br> <p>Thank you for registering</p>",
    };

    this.transport.sendMail(mailOptions, function (err, data) {
      if (err) {
        throw 'An error occured and email could not be sent'
      } else {
        console.log(`Email send to ${username} with ${data}`);
      }
    });
  }

  public async sendforgotPasswordMail(username: string) {
    const user = await this.userService.findUserByName(username);

    const mailOptions = {
      from: '"Issue Tracker " <webtechtestnodemailer@gmail.com>',
      to: user?.email,
      subject: "Password Recovery",
      html: '<h1> this is the forgot password mail </h1>',
    };

    this.transport.sendMail(mailOptions, function (err, data) {
      if (err) {
        console.log("error occured ", err);
      } else {
        console.log(`Email send to ${username} with ${data}`);
      }
    });
  }
  
  public async sendinvitedToAProjectMail(username: string, projectID: number) {
    const user = await this.userService.findUserByName(username);
    
    const mailOptions = {
      from: '"Issue Tracker " <webtechtestnodemailer@gmail.com>',
      to: user?.email,
      subject: "Invited to a Project",
      html: "<h1> Invited to a Project </h1>",
    };

    this.transport.sendMail(mailOptions, function (err, data) {
      if (err) {
        console.log("error occured ", err);
      } else {
        console.log(`Email send to ${username} with ${data}`);
      }
    });
  }
}
