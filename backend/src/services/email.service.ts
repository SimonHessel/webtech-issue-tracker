import { InjectRepository, Injectable } from 'core';
import nodemailer  from "nodemailer";
import { Repository } from "typeorm";
import { User } from "entities/user.entity";
import { UserService } from "services/user.service";

@Injectable()
export class EmailService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly userService: UserService   
  ) {}
  
  private transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
    user: 'webtechtestnodemailer@gmail.com',
    pass: 'webtech2020'
    }
  })
  
  public async sendRegisterMail(username: string) {
    
    const user = await this.userService.findUserByName(username);
    
    const mailOptions = {
      from: '"Issue Tracker " <webtechtestnodemailer@gmail.com>',
      to: user?.email,
      subject: 'Welcome to the Issue Tracker',
      html: '<h1> this is the register email </h1>'
    }
    
    this.transport.sendMail(mailOptions, function (err, data){
      if(err) {
        console.log('error occured ', err)
      } else {
        console.log(`Email send to ${username} with ${data}`)
      }

    })
  }

  public async sendforgotPasswordMail(username: string) {
    const user = await this.userService.findUserByName(username);
    
    const mailOptions = {
      from: '"Issue Tracker " <webtechtestnodemailer@gmail.com>',
      to: user?.email,
      subject: 'Changing your Password for the Issue Tracker',
      html: '<h1 color="blue"> this is the forgot password mail </h1>'
    }
    
    this.transport.sendMail(mailOptions, function (err, data){
      if(err) {
        console.log('error occured ', err)
      } else {
        console.log(`Email send to ${username} with ${data}`)
      }

    })
  }

  public async sendinvitedToAProjectMail(username: string, projectID: number){
    const user = await this.userService.findUserByName(username);
    console.log(projectID);
    const mailOptions = {
      from: '"Issue Tracker " <webtechtestnodemailer@gmail.com>',
      to: user?.email,
      subject: 'Changing your Password for the Issue Tracker',
      html: '<h1> this is the forgot password mail </h1>'
    }
    
    this.transport.sendMail(mailOptions, function (err, data){
      if(err) {
        console.log('error occured ', err)
      } else {
        console.log(`Email send to ${username} with ${data}`)
      }

    })
  } 
}


