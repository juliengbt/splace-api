import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hashString } from 'src/utils/functions';
import { LessThan, Repository } from 'typeorm';
import Token from './token.entity';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private repo: Repository<Token>
  ) {}

  async insertToken(userId: Buffer, rt: string, exp: number): Promise<Token> {
    const token = this.repo.create({
      user: { id: userId },
      exp: new Date(exp * 1000),
      refreshTokenHash: await hashString(rt)
    });

    await this.repo.insert(token);
    return token;
  }

  async updateRefreshToken(
    userId: Buffer,
    rt: string,
    exp: number,
    hashedPreviousRt: string
  ): Promise<void> {
    await this.repo.update(
      { userId: userId, refreshTokenHash: hashedPreviousRt },
      {
        refreshTokenHash: await hashString(rt),
        exp: new Date(exp * 1000)
      }
    );
  }

  async deleteRefreshToken(userId: Buffer, hashedRt: string): Promise<void> {
    await this.deleteExpriedTokens(userId);
    await this.repo.delete({ userId, refreshTokenHash: hashedRt });
  }

  async deleteExpriedTokens(userId: Buffer): Promise<void> {
    await this.repo.delete({ userId, exp: LessThan(new Date()) });
  }
}
