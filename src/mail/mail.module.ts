import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { join } from 'path';
import { MailService } from './mail.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: 'ssl0.ovh.net',
          port: 587,
          secure: false,
          auth: {
            user: 'contact@splace.app',
            pass: config.get('MAIL_PASSWORD')
          },
          tls: {
            ciphers: 'SSLv3'
          }
        },
        defaults: {
          from: '"Splace" <noreply@splace.app>'
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
          options: {
            strict: true
          }
        }
      })
      // transport: 'smtps://user@example.com:topsecret@smtp.example.com',
      // or
    })
  ],
  providers: [MailService],
  exports: [MailService]
})
export class MailModule {}
