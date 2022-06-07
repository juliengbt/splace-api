import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException
} from '@nestjs/common';
import { UserService } from 'src/models/user/user.service';
import argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/types';
import BaseUserSignin from 'src/models/user/dto/baseUser.signin';
import { Tokens } from './dto/tokens.dto';
import { MailService } from 'src/mail/mail.service';
import BaseUser from 'src/models/user/entities/baseUser.entity';
import { TokenService } from 'src/models/token/token.service';
import ProUserCreate from 'src/models/user/dto/proUser.create';
import RegularUserCreate from 'src/models/user/dto/regularUser.create';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private tokenService: TokenService,
    private jwtService: JwtService,
    private mailService: MailService
  ) {}

  async signin(userSignin: BaseUserSignin): Promise<Tokens> {
    const user = await this.usersService.findByEmail(userSignin.email);
    if (!user) throw new ForbiddenException(undefined, 'Access Denied');

    const match = await argon.verify(user.password, userSignin.password);

    if (!match) throw new ForbiddenException(undefined, 'Access Denied');

    const tokens = await this.getTokens(user.id, user.email);
    const exp = this.getTokenExp(tokens.refresh_token);

    if (!exp) throw new InternalServerErrorException('Error while decoding refresh token');
    await this.tokenService.insertToken(user.id, tokens.refresh_token, exp);

    // Delete expired tokens
    this.tokenService.deleteExpriedTokens(user.id);

    return tokens;
  }

  async signup(u: RegularUserCreate | ProUserCreate): Promise<Tokens> {
    const exists = await this.usersService.findByEmail(u.user.email);
    if (exists)
      throw new ConflictException(undefined, `User already exists with email: ${u.user.email}`);

    const userId = await this.usersService.create(u);
    const tokens = await this.getTokens(userId, u.user.email);
    const exp = this.getTokenExp(tokens.refresh_token);

    if (!exp) throw new InternalServerErrorException('Error while decoding refresh token');
    await this.tokenService.insertToken(userId, tokens.refresh_token, exp);

    return tokens;
  }

  async logout(userId: Buffer, rt: string): Promise<boolean> {
    const user = await this.usersService.findById(userId);
    if (!user || user.tokens.length == 0) return false;

    let rtMatches = false;
    let i = 0;
    while (!rtMatches && i < user.tokens.length) {
      if (await argon.verify(user.tokens[i].refresh_token_hash, rt)) rtMatches = true;
      else i++;
    }

    if (!rtMatches) return false;

    const res = await this.tokenService.deleteRefreshToken(
      userId,
      user.tokens[i].refresh_token_hash
    );

    // Delete expired tokens
    this.tokenService.deleteExpriedTokens(userId);

    return res ? true : false;
  }

  async refreshTokens(userId: Buffer, rt: string): Promise<Tokens> {
    const user = await this.usersService.findById(userId);
    if (!user || user.tokens.length == 0) throw new ForbiddenException('Access Denied');

    let rtMatches = false;
    let i = 0;
    while (!rtMatches && i < user.tokens.length) {
      if (await argon.verify(user.tokens[i].refresh_token_hash, rt)) rtMatches = true;
      else i++;
    }

    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email);
    const exp = this.getTokenExp(tokens.refresh_token);

    if (!exp) throw new InternalServerErrorException('Error while decoding refresh token');
    await this.tokenService.updateRefreshToken(
      userId,
      tokens.refresh_token,
      exp,
      user.tokens[i].refresh_token_hash
    );

    return tokens;
  }

  async confirmEmail(userId: Buffer): Promise<void> {
    await this.usersService.confirmEmail(userId);
  }

  async emailExist(email: string): Promise<boolean> {
    return (await this.usersService.findByEmail(email)) == null ? false : true;
  }

  async sendConfirmationMail(user: BaseUser): Promise<void> {
    const payload: JwtPayload = {
      sub: user.id.toString('base64url'),
      email: user.email
    };
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '6h',
      secret: 'mt-' + process.env.JWT_SECRET
    });
    await this.mailService.sendUserConfirmation(user, token);
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

  private getTokenExp(token: string): number | null {
    const t = this.jwtService.decode(token, { complete: false, json: true });

    if (t && typeof t === 'object' && 'exp' in t) {
      return t.exp;
    }
    return null;
  }
}
