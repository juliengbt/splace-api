import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Installation from 'src/entities/installation.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';

@Injectable()
export default class InstallationService {
  constructor(
    @InjectRepository(Installation)
    private categoryRepo: Repository<Installation>
  ) {}

  async findById(id: string): Promise<Installation | undefined> {
    return this.getFullObject()
      .where('Installation.id = UUID_TO_BIN(:id_installation)', { id_installation: id })
      .getOne();
  }

  private getFullObject(): SelectQueryBuilder<Installation> {
    return this.categoryRepo.createQueryBuilder('Installation')
      .leftJoinAndSelect('Installation.city', 'city')
      .leftJoinAndSelect('city.department', 'department')
      .leftJoinAndSelect('Installation.address', 'address')
      .leftJoinAndSelect('Installation.equipments', 'equipments')
      .leftJoinAndSelect('equipments.owner', 'owner')
      .leftJoinAndSelect('equipments.soil_type', 'soil_type')
      .leftJoinAndSelect('equipments.equipment_nature', 'equipment_nature')
      .leftJoinAndSelect('equipments.equipment_type', 'equipment_type')
      .leftJoinAndSelect('equipments.equipment_level', 'equipment_level')
      .leftJoinAndSelect('equipments.sports', 'sports')
      .leftJoinAndSelect('sports.category', 'category')
      .leftJoinAndSelect('equipments.pictures', 'pictures');
  }
}
