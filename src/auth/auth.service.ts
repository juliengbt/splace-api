import { ForbiddenException, Injectable } from '@nestjs/common';
import { BaseUserService } from '../baseUser/baseUser.service';
import argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/types';
import BaseUserSignin from 'src/baseUser/dto/baseUser.signin';
import BaseUserCreate from 'src/baseUser/dto/baseUser.create';
import { Tokens } from './dto/tokens.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: BaseUserService, private jwtService: JwtService) {}

  async signin(userSignin: BaseUserSignin): Promise<Tokens> {
    const user = await this.usersService.findByEmail(userSignin.email);
    if (!user) throw new ForbiddenException(undefined, 'Access Denied');

    const match = await argon.verify(user.password, userSignin.password);

    if (!match) throw new ForbiddenException(undefined, 'Access Denied');

    const tokens = await this.getTokens(user.id, user.email);
    await this.usersService.updateRefreshToken(user.id, tokens.refresh_token);
    return tokens;
  }

  async signup(user: BaseUserCreate): Promise<Tokens> {
    const userId = await this.usersService.create(user);
    const tokens = await this.getTokens(userId, user.email);
    this.usersService.updateRefreshToken(userId, tokens.refresh_token);

    return tokens;
  }

  async logout(userId: Buffer): Promise<boolean> {
    const res = await this.usersService.updateRefreshToken(userId, null);
    return res ? true : false;
  }

  async refreshTokens(userId: Buffer, rt: string): Promise<Tokens> {
    const user = await this.usersService.findById(userId);
    if (!user || !user.refresh_token_hash) throw new ForbiddenException('Access Denied');

    const rtMatches = await argon.verify(user.refresh_token_hash, rt);
    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email);
    await this.usersService.updateRefreshToken(user.id, tokens.refresh_token);

    return tokens;
  }

  private async getTokens(userId: Buffer, email: string): Promise<Tokens> {
    const payload: JwtPayload = {
      sub: userId.toString('base64url'),
      email: email
    };
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: '15m',
        secret: 'at-' + process.env.JWT_SECRET
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: '7d',
        secret: 'rt-' + process.env.JWT_SECRET
      })
    ]);

    return {
      access_token: at,
      refresh_token: rt
    };
  }
}
