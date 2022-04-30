import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { BaseUserModule } from '../baseUser/baseUser.module';
import { JwtRefreshStrategy } from './strategies/rt.strategy';
import { JwtAccessStrategy } from './strategies/at.strategy';
import { AuthController } from './auth.controller';

@Module({
  imports: [BaseUserModule, PassportModule, JwtModule.register({})],
  providers: [AuthService, JwtRefreshStrategy, JwtAccessStrategy],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
