import { InjectRepository, Injectable } from "core";
import nodemailer from "nodemailer";
import { Repository } from "typeorm";
import { User } from "entities/user.entity";
import { UserService } from "services/user.service";
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class EmailService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly userService: UserService
  ) { }

  private transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "2e3828af2c1ed4",
      pass: "5c9f73c77c2960"
    }
  });

  public async sendRegisterMail(username: string) {
    const user = await this.userService.findUserByName(username);
    const randomToken = uuidv4();
    // random token in datenbank speichern
    const link = 'http://localhost:4200/auth/confirm/' + randomToken;
    const mailOptions = {
      from: '"Issue Tracker " <smtp.mailtrap.io>',
      to: user?.email,
      subject: "Welcome to the Issue Tracker",
      html: '<p>Hello '+username+'</p></br><p> Thank you for registering. '+
            'To complete the registration process and verify your Account, click on this link:'+
            '</br><a href='+link+'>Click here to verify</a></p>'
    };

    this.transport.sendMail(
      mailOptions, 
      function (err, data) 
      {
      if (err) {
        throw 'An error occured and email could not be sent'
      } else {
        console.log('Email send !!!');
      }
    });
  }

  public async sendforgotPasswordMail(username: string) {
    const user = await this.userService.findUserByName(username);
    const VerificationToken = uuidv4();
    const link = 'http://localhost:4200/auth/password-reset/'+VerificationToken;
    // randomToken in datenbank speichern
    const mailOptions = {
      from: '"Issue Tracker " <smtp.mailtrap.io>',
      to: user?.email,
      subject: "Password Recovery",
      html: '<p> Hey '+username+'. </p></br> <p> To reset your email please Click on this link:' + 
            '</br><a href='+link+'></a>Click here to reset Password </p>',
    };

    this.transport.sendMail(mailOptions, function (err, data) {
      if (err) {
        throw 'An error occured and email could not be sent'
      } else {
        console.log('Email send !!!');
      }
    });
  }
  
  public async sendinvitedToAProjectMail(username: string, projectID: number) {
    const user = await this.userService.findUserByName(username);
    const link = 'http://localhost:4200/projects/'+projectID;
    const mailOptions = {
      from: '"Issue Tracker " <smtp.mailtrap.io>',
      to: user?.email,
      subject: "You have been invited to a Project",
      html: '<p>Hey '+username+' you have been invited to a Project. Click on this link to get to it'+
            '</br><a href='+link+'>Click here</a></p>',
    };

    this.transport.sendMail(mailOptions, function (err, data) {
      if (err) {
        throw 'An error occured and email could not be sent'
      } else {
        console.log('Email send !!!');
      }
    });
  }
}
