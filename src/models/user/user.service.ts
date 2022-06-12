import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BaseUser, { Role } from 'src/models/user/entities/baseUser.entity';
import { hashString as generatePasswordHash } from 'src/utils/functions';
import { DeepPartial, Repository, SelectQueryBuilder } from 'typeorm';
import City from '../city/city.entity';
import Sport from '../sport/sport.entity';
import ProUserCreate from './dto/proUser.create';
import RegularUserCreate from './dto/regularUser.create';
import ProUser from './entities/proUser.entity';
import RegularUser from './entities/regularUser.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(BaseUser)
    private repo: Repository<BaseUser>,
    @InjectRepository(RegularUser)
    private regularRepo: Repository<RegularUser>,
    @InjectRepository(ProUser)
    private proRepo: Repository<ProUser>
  ) {}

  async findById(id: Buffer): Promise<ProUser | RegularUser | null> {
    const proUser = await this.getFullObjectQueryPro().where('user.id = :id', { id }).getOne();
    if (proUser) return proUser;
    else return this.getFullObjectQueryReg().where('user.id = :id', { id }).getOne();
  }

  async findBaseUserById(id: Buffer): Promise<BaseUser | null> {
    return this.repo.findOne({ where: { id: id } });
  }

  async create(u: RegularUserCreate | ProUserCreate): Promise<Buffer> {
    u.user.password = await generatePasswordHash(u.user.password);

    if (u instanceof RegularUserCreate) {
      const userToSave = this.regularRepo.create(u);
      userToSave.user.role = Role.REGULAR;
      return this.regularRepo.save(userToSave).then((userRes) => userRes.user as unknown as Buffer);
    }

    if (u instanceof ProUserCreate) {
      const userToSave = this.proRepo.create({
        user: { ...u.user, sports: u.sportsCode.map((s) => ({ code: s } as DeepPartial<Sport>)) },
        cities: u.citiesId.map((s) => ({ id: Buffer.from(s, 'base64url') } as DeepPartial<City>))
      });
      userToSave.user.role = Role.PRO;
      return this.proRepo.save(userToSave).then((userRes) => userRes.user as unknown as Buffer);
    }

    throw Error('user is neither regular or pro');
  }

  async confirmEmail(userId: Buffer) {
    return this.repo.update(
      {
        id: userId
      },
      {
        is_email_confirmed: true
      }
    );
  }

  async findByEmail(email: string): Promise<BaseUser | null> {
    const query = this.getFullObjectQuery();

    query.where('BaseUser.email =:user_email', { user_email: email });

    return query.getOne();
  }

  private getFullObjectQuery(): SelectQueryBuilder<BaseUser> {
    return this.repo
      .createQueryBuilder('BaseUser')
      .leftJoinAndMapMany('BaseUser.sports', 'BaseUser.sports', 'sport');
  }

  private getFullObjectQueryPro(): SelectQueryBuilder<ProUser> {
    return this.proRepo
      .createQueryBuilder('ProUser')
      .leftJoinAndMapOne('ProUser.user', 'ProUser.user', 'user')
      .leftJoinAndMapMany('user.sports', 'user.sports', 'sports')
      .leftJoinAndMapMany('sports.category', 'sports.category', 'category')
      .leftJoinAndMapMany('ProUser.cities', 'ProUser.cities', 'cities')
      .leftJoinAndMapOne('cities.department', 'cities.department', 'department');
  }

  private getFullObjectQueryReg(): SelectQueryBuilder<RegularUser> {
    return this.regularRepo
      .createQueryBuilder('RegularUser')
      .leftJoinAndMapOne('RegularUser.user', 'RegularUser.user', 'user')
      .leftJoinAndMapMany('user.sports', 'user.sports', 'sports')
      .leftJoinAndMapMany('sports.category', 'sports.category', 'category');
  }
}
