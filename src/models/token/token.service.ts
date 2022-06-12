import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hashString } from 'src/utils/functions';
import { Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import Token from './token.entity';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private repo: Repository<Token>
  ) {}

  async insertToken(userId: Buffer, rt: string, exp: number): Promise<number> {
    const token: QueryDeepPartialEntity<Token> = {
      user: { id: userId },
      exp: new Date(exp * 1000),
      refresh_token_hash: await hashString(rt),
      last_connection: new Date()
    };

    return this.repo
      .createQueryBuilder()
      .insert()
      .into(Token)
      .values(token)
      .execute()
      .then((res) => res.raw)
      .catch((err) => {
        console.error(err);
        return 0;
      });
  }

  async updateRefreshToken(
    userId: Buffer,
    rt: string,
    exp: number,
    hashedPreviousRt: string
  ): Promise<number> {
    return this.repo
      .createQueryBuilder()
      .update(Token)
      .set({
        refresh_token_hash: await hashString(rt),
        exp: new Date(exp * 1000),
        last_connection: new Date()
      })
      .where('id_user = :id_user', { id_user: userId })
      .andWhere('refresh_token_hash = :rt', { rt: hashedPreviousRt })
      .execute()
      .then((res) => res.raw)
      .catch((err) => {
        console.error(err);
        return 0;
      });
  }

  async deleteRefreshToken(userId: Buffer, hashedRt: string): Promise<number> {
    return this.repo
      .createQueryBuilder()
      .delete()
      .from(Token)
      .where('id_user = :id_user', { id_user: userId })
      .andWhere('refresh_token_hash = :rt', { rt: hashedRt })
      .execute()
      .then((res) => res.affected || 0)
      .catch((err) => {
        console.error(err);
        return 0;
      });
  }

  async deleteExpriedTokens(userId: Buffer): Promise<number> {
    return this.repo
      .createQueryBuilder()
      .delete()
      .from(Token)
      .where('id_user = :id_user', { id_user: userId })
      .andWhere('exp < :now', { now: new Date() })
      .execute()
      .then((res) => res.affected || 0)
      .catch((err) => {
        console.error(err);
        return 0;
      });
  }
}
