import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BaseUser, { Role } from 'src/models/user/entities/baseUser.entity';
import { hashString as generatePasswordHash } from 'src/utils/functions';
import { DeepPartial, Repository, SelectQueryBuilder } from 'typeorm';
import City from '../city/city.entity';
import Equipment from '../equipment/equipment.entity';
import Sport from '../sport/sport.entity';
import ProUserCreate from './dto/proUser.create';
import ProUserSearch from './dto/proUser.search';
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

  async getProById(id: Buffer): Promise<ProUser | null> {
    return this.getFullObjectQueryPro().where('user.id = :id', { id }).getOne();
  }

  async getRegById(id: Buffer): Promise<RegularUser | null> {
    return this.getFullObjectQueryReg().where('user.id = :id', { id }).getOne();
  }

  async getProDetailById(id: Buffer): Promise<ProUser | null> {
    return this.getProDetailsQuery().where('user.id = :id', { id }).getOne();
  }

  async findBaseUserById(id: Buffer): Promise<BaseUser | null> {
    return this.repo.findOne({ where: { id: id } });
  }

  async findProUsers(proUserSearch: ProUserSearch, offset: number): Promise<ProUser[]> {
    const query = this.getProDetailsQuery();

    query.where('user.is_deleted is :is_del', { is_del: false });

    if (proUserSearch.sport) {
      query.andWhere('sports.code = :sport', { sport: proUserSearch.sport });
    } else if (proUserSearch.category) {
      query.andWhere('sports.category = :cat', { cat: proUserSearch.category });
    }

    if (proUserSearch.cityId) {
      query.andWhere('cities.id = :city', { city: Buffer.from(proUserSearch.cityId, 'base64url') });
    }

    if (proUserSearch.name) {
      const clause = 'MATCH(user.name) AGAINST (:u_name IN BOOLEAN MODE)';
      query.andWhere(clause, {
        u_name: '*' + proUserSearch.name.split(' ').join('*') + '*'
      });
      query
        .addSelect(`(${clause})`, 'keyword_rank')
        .having('keyword_rank > 0')
        .addOrderBy('keyword_rank', 'DESC');
    }

    return query.skip(offset).take(50).getMany();
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
    return this.repo.findOne({ where: { email } });
  }

  /**
   * Add equipment to favorites, removes it if equipment is already in favorite
   * @param user User to update
   * @param equipment Equipment to add/remove of favorites
   * @returns true if is equipment is a new fav of user, false otherwise
   */
  async updateFavorite(user: BaseUser, equipment: Equipment): Promise<boolean> {
    const favIndex = user.equipments.findIndex(
      (e) => e.id.toString('base64url') === equipment.id.toString('base64url')
    );

    if (favIndex >= 0)
      await this.getBaseUserQuery().relation('equipments').of(user).remove(equipment);
    else await this.getBaseUserQuery().relation('equipments').of(user).add(equipment);
    return favIndex < 0;
  }

  /**
   * Make reg member of pro
   * @param pro user to receive the member
   * @param reg User to be member
   * @returns true if reg was added as a member, false if reg is already member
   */
  async addMember(pro: ProUser, reg: RegularUser): Promise<boolean> {
    const memberIndex = pro.members?.findIndex(
      (m) => m.user.id.toString('base64url') === reg.user.id.toString('base64url')
    );

    if (!memberIndex || memberIndex >= 0) return false;

    await this.getFullObjectQueryPro().relation('members').of(pro).add(reg);
    return true;
  }

  /**
   * Removes reg from pro's member list
   * @param pro user with the member list
   * @param reg user to remove from the member list
   * @returns true if reg was successfully removed, false if reg isn't member of pro
   */
  async removeMember(pro: ProUser, reg: RegularUser): Promise<boolean> {
    const memberIndex = pro.members?.findIndex(
      (m) => m.user.id.toString('base64url') === reg.user.id.toString('base64url')
    );

    if (!memberIndex || memberIndex < 0) return false;

    await this.getFullObjectQueryPro().relation('members').of(pro).remove(reg);
    return true;
  }

  private getBaseUserQuery(): SelectQueryBuilder<BaseUser> {
    return this.repo
      .createQueryBuilder('BaseUser')
      .leftJoinAndMapMany('BaseUser.sports', 'BaseUser.sports', 'sport')
      .leftJoinAndMapMany('BaseUser.equipments', 'BaseUser.equipments', 'equipments');
  }

  private getFullObjectQueryPro(): SelectQueryBuilder<ProUser> {
    return this.joinEquipment(
      this.proRepo
        .createQueryBuilder('ProUser')
        .leftJoinAndMapOne('ProUser.user', 'ProUser.user', 'user')
        .leftJoinAndMapMany('user.sports', 'user.sports', 'sports')
        .leftJoinAndMapMany('sports.category', 'sports.category', 'category')
        .leftJoinAndMapMany('ProUser.cities', 'ProUser.cities', 'cities')
        .leftJoinAndMapOne('cities.department', 'cities.department', 'department')
        .leftJoinAndMapMany('user.equipments', 'user.equipments', 'equipments')
        .leftJoinAndMapMany('ProUser.members', 'ProUser.members', 'members')
    );
  }

  private getProDetailsQuery(): SelectQueryBuilder<ProUser> {
    return this.proRepo
      .createQueryBuilder('ProUser')
      .leftJoinAndMapOne('ProUser.user', 'ProUser.user', 'user')
      .leftJoinAndMapMany('user.sports', 'user.sports', 'sports')
      .leftJoinAndMapMany('ProUser.cities', 'ProUser.cities', 'cities')
      .leftJoinAndMapOne('cities.department', 'cities.department', 'department');
  }

  private getFullObjectQueryReg(): SelectQueryBuilder<RegularUser> {
    return this.joinEquipment(
      this.regularRepo
        .createQueryBuilder('RegularUser')
        .leftJoinAndMapOne('RegularUser.user', 'RegularUser.user', 'user')
        .leftJoinAndMapMany('user.sports', 'user.sports', 'sports')
    );
  }

  private joinEquipment(query: SelectQueryBuilder<any>) {
    return query
      .leftJoinAndMapMany('user.equipments', 'user.equipments', 'equipments')
      .leftJoinAndMapOne(
        'equipments.installation',
        'equipments.installation',
        'equipment_installation'
      )
      .leftJoinAndMapOne(
        'equipment_installation.address',
        'equipment_installation.address',
        'equipment_address'
      )
      .leftJoinAndMapOne(
        'equipment_address.zipcode',
        'equipment_address.zipcode',
        'equipment_zipcode'
      )
      .leftJoinAndMapOne('equipment_zipcode.city', 'equipment_zipcode.city', 'equipment_city')
      .leftJoinAndMapOne(
        'equipment_city.department',
        'equipment_city.department',
        'equipment_department'
      )
      .leftJoinAndMapOne('equipments.owner', 'equipments.owner', 'owner')
      .leftJoinAndMapOne('equipments.soil_type', 'equipments.soil_type', 'soil_type')
      .leftJoinAndMapOne(
        'equipments.equipment_nature',
        'equipments.equipment_nature',
        'equipment_nature'
      )
      .leftJoinAndMapOne('equipments.equipment_type', 'equipments.equipment_type', 'equipment_type')
      .leftJoinAndMapOne(
        'equipments.equipment_level',
        'equipments.equipment_level',
        'equipment_level'
      )
      .leftJoinAndMapMany('equipments.sports', 'equipments.sports', 'equipment_sports')
      .leftJoinAndMapMany('equipments.pictures', 'equipments.pictures', 'pictures');
  }
}
