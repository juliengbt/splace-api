import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hashString as generatePasswordHash } from 'src/utils/functions';
import { Repository, SelectQueryBuilder } from 'typeorm';
import Equipment from '../equipment/entities/equipment.entity';
import EquipmentService from '../equipment/equipment.service';
import UserCreate from './dto/user.create';
import User from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
    private readonly equipmentService: EquipmentService
  ) {}

  async findById(id: Buffer): Promise<User> {
    const user = await this.repo.findOne({
      where: { id: id }
    });
    if (!user) throw new NotFoundException();
    return user;
  }

  async create(u: UserCreate): Promise<User> {
    if (await this.repo.findOneBy({ email: u.email }))
      throw new ConflictException(undefined, 'Cette adresse email est déjà utilisée');
    u.password = await generatePasswordHash(u.password);

    const user = this.repo.create(u);
    await this.repo.insert(user);
    return user;
  }

  async confirmEmail(userId: Buffer) {
    return this.repo.update(
      {
        id: userId
      },
      {
        isEmailConfirmed: true
      }
    );
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.repo.findOneBy({ email });
    if (!user) throw new NotFoundException();
    return user;
  }

  /**
   * Add equipment to favorites, removes it if equipment is already in favorite
   * @param user User to update
   * @param equipment Equipment to add/remove of favorites
   * @returns true if is equipment is a new fav of user, false otherwise
   */
  async updateFavorite(userId: Buffer, equipmentId: Buffer): Promise<boolean> {
    const user = await this.findById(userId);
    const favIndex = user.savedEquipments.findIndex(
      (e) => e.id.toString('base64url') === equipmentId.toString('base64url')
    );
    const equipment = await this.equipmentService.findById(equipmentId);

    if (favIndex >= 0)
      await this.getBaseUserQuery().relation(User, 'savedEquipments').of(user).remove(equipment);
    else await this.getBaseUserQuery().relation(User, 'savedEquipments').of(user).add(equipment);
    return favIndex < 0;
  }

  async getSavedEquipments(userId: Buffer): Promise<Equipment[]> {
    return this.equipmentService.loadSavedEquipments(userId);
  }

  private getBaseUserQuery(): SelectQueryBuilder<User> {
    return this.repo
      .createQueryBuilder('BaseUser')
      .leftJoinAndMapMany('BaseUser.sports', 'BaseUser.sports', 'sport')
      .leftJoinAndMapMany('BaseUser.equipments', 'BaseUser.equipments', 'equipments');
  }
}
