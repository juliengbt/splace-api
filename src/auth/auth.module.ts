import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { BaseUserModule } from '../baseUser/baseUser.module';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [BaseUserModule, PassportModule],
  providers: [AuthService, LocalStrategy]
})
export class AuthModule {}
