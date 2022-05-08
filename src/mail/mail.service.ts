import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import BaseUser from 'src/baseUser/baseUser.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: BaseUser, token: string) {
    const url = `https://splace.app//confirm?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Splace - Confirmation adresse email',
      template: __dirname + '/confirmation', // `.hbs` extension is appended automatically
      context: {
        name: user.name,
        url
      }
    });
  }
}
