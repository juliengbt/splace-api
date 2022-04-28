import { ForbiddenException, Injectable } from '@nestjs/common';
import { BaseUserService } from '../baseUser/baseUser.service';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Tokens } from 'src/types';
import BaseUserSignin from 'src/baseUser/dto/baseUser.signin';
import BaseUser from 'src/baseUser/baseUser.entity';

@Injectable()
export class AuthService {
  constructor(private usersService: BaseUserService, private jwtService: JwtService) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user) {
      const match = await bcrypt.compare(pass, user.password);
      if (match) return user;
    }
    return null;
  }

  async getTokens(userId: Buffer, email: string): Promise<Tokens> {
    const payload = {
      id: userId,
      email: email
    };
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: 60 * 15,
        secret: 'at-' + process.env.JWT_SECRET
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: 60 * 60 * 24 * 7,
        secret: 'rt-' + process.env.JWT_SECRET
      })
    ]);

    return {
      access_token: at,
      refresh_token: rt
    };
  }

  async signin(userSignin: BaseUserSignin): Promise<BaseUser> {
    const user = await this.usersService.findByEmail(userSignin.email);
    if (!user) throw new ForbiddenException(undefined, 'Access Denied');

    const match = await bcrypt.compare(userSignin.password, user.password);

    if (!match) throw new ForbiddenException(undefined, 'Access Denied');

    const tokens = await this.getTokens(user.id, user.email);
    await this.usersService.updateRefreshToken(user.id, tokens.refresh_token);
    return user;
  }
}
