import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import argon from 'argon2';
import { MailService } from 'src/mail/mail.service';
import { TokenService } from 'src/models/token/token.service';
import UserCreate from 'src/models/user/dto/user.create';
import BaseUserSignin from 'src/models/user/dto/user.signin';
import User from 'src/models/user/entities/user.entity';
import { UserService } from 'src/models/user/user.service';
import { JwtPayload } from 'src/types';
import { Repository } from 'typeorm';
import { Tokens } from './dto/tokens.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private usersService: UserService,
    private tokenService: TokenService,
    private jwtService: JwtService,
    private mailService: MailService
  ) {}

  async signin(userSignin: BaseUserSignin): Promise<Tokens> {
    const user = await this.usersService.findByEmail(userSignin.email);

    const match = await argon.verify(user.password, userSignin.password);

    if (!match) throw new ForbiddenException(undefined, 'Access Denied');

    const tokens = await this.getTokens(user.id, user.email);
    const exp = this.getTokenExp(tokens.refreshToken);

    if (!exp) throw new InternalServerErrorException('Error while decoding refresh token');
    await this.tokenService.insertToken(user.id, tokens.refreshToken, exp);

    // Delete expired tokens
    this.tokenService.deleteExpriedTokens(user.id);

    return tokens;
  }

  async signup(u: UserCreate): Promise<Tokens> {
    const exists = await this.userRepo.findOneBy({ email: u.email });
    if (exists)
      throw new ConflictException(undefined, `User already exists with email: ${u.email}`);

    const user = await this.usersService.create(u);
    const tokens = await this.getTokens(user.id, user.email);
    const exp = this.getTokenExp(tokens.refreshToken);

    if (!exp)
      throw new InternalServerErrorException(undefined, 'Error while decoding refresh token');
    await this.tokenService.insertToken(user.id, tokens.refreshToken, exp);
    return tokens;
  }

  async logout(userId: string, rt: string): Promise<void> {
    const user = await this.usersService.findById(userId);
    if (await argon.verify(user.token.refreshTokenHash, rt)) {
      await this.tokenService.deleteRefreshToken(userId, user.token.refreshTokenHash);
    }
  }

  async refreshTokens(userId: string, rt: string): Promise<Tokens> {
    const user = await this.usersService.findById(userId);
    if (await argon.verify(user.token.refreshTokenHash, rt)) throw new ForbiddenException();

    const tokens = await this.getTokens(user.id, user.email);
    const exp = this.getTokenExp(tokens.refreshToken);

    if (!exp) throw new InternalServerErrorException('Error while decoding refresh token');
    await this.tokenService.updateRefreshToken(
      userId,
      tokens.refreshToken,
      exp,
      user.token.refreshTokenHash
    );

    return tokens;
  }

  async confirmEmail(userId: string): Promise<void> {
    await this.usersService.confirmEmail(userId);
  }

  async sendConfirmationMail(userId: string): Promise<void> {
    const user = await this.usersService.findById(userId);
    if (user.isEmailConfirmed) throw new ConflictException('Email is already confirmed');

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email
    };
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '6h',
      secret: 'mt-' + process.env.JWT_SECRET
    });
    await this.mailService.sendUserConfirmation(user, token);
  }

  private async getTokens(userId: string, email: string): Promise<Tokens> {
    const payload: JwtPayload = {
      sub: userId,
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
      accessToken: at,
      refreshToken: rt
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
