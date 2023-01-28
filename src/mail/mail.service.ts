import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import User from 'src/models/user/entities/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: User, token: string) {
    const url = `https://splace.app/user?email_token=${token}`;
    try {
      await this.mailerService.sendMail({
        to: user.email,
        // from: '"Support Team" <support@example.com>', // override default from
        subject: 'Splace - Confirmation adresse email',
        template: 'confirmation', // `.hbs` extension is appended automatically
        context: {
          name: user.firstname,
          url
        }
      });
    } catch (err) {
      console.error(err);
    }
  }
}
