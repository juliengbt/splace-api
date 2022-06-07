import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { UserModule } from 'src/models/user/user.module';
import { JwtRefreshStrategy } from './strategies/rt.strategy';
import { JwtAccessStrategy } from './strategies/at.strategy';
import { AuthController } from './auth.controller';
import { JwtMailStrategy } from './strategies/mt.strategy';
import { MailModule } from 'src/mail/mail.module';
import { TokenModule } from 'src/models/token/token.module';

@Module({
  imports: [UserModule, MailModule, PassportModule, TokenModule, JwtModule.register({})],
  providers: [AuthService, JwtRefreshStrategy, JwtAccessStrategy, JwtMailStrategy],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
