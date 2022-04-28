import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { BaseUserModule } from '../baseUser/baseUser.module';
import { JwtRefreshStrategy } from './rt.strategy';
import { LocalStrategy } from './local.strategy';
import { JwtAccessStrategy } from './at.strategy';

@Module({
  imports: [BaseUserModule, PassportModule, JwtModule.register({})],
  providers: [AuthService, LocalStrategy, JwtRefreshStrategy, JwtAccessStrategy],
  exports: [AuthService]
})
export class AuthModule {}
