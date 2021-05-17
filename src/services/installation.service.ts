import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Installation from 'src/entities/installation.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';

@Injectable()
export default class InstallationService {
  constructor(
    @InjectRepository(Installation)
    private repo: Repository<Installation>
  ) {}

  async findById(id: string): Promise<Installation | undefined> {
    return this.getFullObjectQuery()
      .where('Installation.id = UUID_TO_BIN(:id_installation)', { id_installation: id })
      .getOne();
  }

  private getFullObjectQuery(): SelectQueryBuilder<Installation> {
    return this.repo.createQueryBuilder('Installation')
      .leftJoinAndSelect('Installation.address', 'address')
      .leftJoinAndSelect('Installation.equipments', 'equipments')
      .leftJoinAndSelect('equipments.owner', 'owner')
      .leftJoinAndSelect('equipments.soil_type', 'soil_type')
      .leftJoinAndSelect('equipments.equipment_nature', 'equipment_nature')
      .leftJoinAndSelect('equipments.equipment_type', 'equipment_type')
      .leftJoinAndSelect('equipments.equipment_level', 'equipment_level')
      .leftJoinAndSelect('equipments.sports', 'sports')
      .leftJoinAndSelect('sports.category', 'category')
      .leftJoinAndSelect('equipments.pictures', 'pictures')
      .leftJoinAndMapOne('address.zipcode', 'address.zipcode', 'zipcode')
      .leftJoinAndMapOne('zipcode.city', 'zipcode.city', 'city')
      .leftJoinAndMapOne('city.department', 'city.department', 'department');
  }
}
