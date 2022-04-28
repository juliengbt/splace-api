import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BaseUser from 'src/baseUser/baseUser.entity';
import { hashString as generatePasswordHash, hashString } from 'src/utils/functions';
import { Repository, SelectQueryBuilder } from 'typeorm';
import BaseUserCreate from './dto/baseUser.create';

@Injectable()
export class BaseUserService {
  constructor(
    @InjectRepository(BaseUser)
    private repo: Repository<BaseUser>
  ) {}

  async findById(id: Buffer): Promise<BaseUser | null> {
    return this.repo.findOne({ where: { id: id } });
  }

  async create(user: BaseUserCreate): Promise<Buffer> {
    user.password = await generatePasswordHash(user.password);
    const userToSave = this.repo.create(user);
    return this.repo.save(userToSave).then((userRes) => userRes.id);
  }

  async updateRefreshToken(userId: Buffer, rt: string | null) {
    const now = new Date();
    this.repo.update(
      { id: userId },
      {
        refresh_token_hash: rt ? await hashString(rt) : null,
        last_connection: rt ? now : undefined,
        refresh_token_timestamp: rt ? now : null
      }
    );
  }

  async findByEmail(email: string): Promise<BaseUser | null> {
    const query = this.getFullObjectQuery();

    query.where('BaseUser.email =:user_email', { user_email: email });

    return query.getOne();
  }

  private getFullObjectQuery(): SelectQueryBuilder<BaseUser> {
    return this.repo.createQueryBuilder('BaseUser');
  }
}
