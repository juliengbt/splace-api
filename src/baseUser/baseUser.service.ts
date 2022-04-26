import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BaseUser from 'src/baseUser/baseUser.entity';
import { generatePassword as generatePasswordHash } from 'src/utils/functions';
import { Repository, SelectQueryBuilder } from 'typeorm';
import BaseUserCreate from './dto/baseUser.create';

@Injectable()
export class BaseUserService {
  constructor(
    @InjectRepository(BaseUser)
    private repo: Repository<BaseUser>
  ) {}

  async create(user: BaseUserCreate): Promise<BaseUser> {
    user.password = await generatePasswordHash(user.password);
    const userToSave = this.repo.create(user);
    return this.repo.save(userToSave);
  }

  async findByEmail(email: string): Promise<BaseUser | undefined> {
    const query = this.getFullObjectQuery();

    query.where('BaseUser.email =:user_email', { user_email: email });

    return query.getOne();
  }

  private getFullObjectQuery(): SelectQueryBuilder<BaseUser> {
    return this.repo.createQueryBuilder('BaseUser');
  }
}
