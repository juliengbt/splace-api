import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Installation from 'src/entities/installation.entity';
import { DeepPartial, Repository, SelectQueryBuilder } from 'typeorm';

@Injectable()
export default class InstallationService {
  constructor(
    @InjectRepository(Installation)
    private repo: Repository<Installation>
  ) {}

  async findById(id: Buffer): Promise<Installation | undefined> {
    return this.getFullObjectQuery()
      .where('Installation.id = :id_installation', { id_installation: id })
      .getOne();
  }

  async update(installation: DeepPartial<Installation>): Promise<Installation> {
    return this.repo.save(installation);
  }

  async countInstallationWithAddress(idAddress: Buffer) : Promise<number> {
    return this.repo.count({
      where: {
        address: idAddress
      }
    });
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
