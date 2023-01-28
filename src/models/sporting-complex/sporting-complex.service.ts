import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import SportingComplex from 'src/models/sporting-complex/sporting-complex.entity';
import { DeepPartial, Repository, SelectQueryBuilder } from 'typeorm';

@Injectable()
export default class SportingComplexService {
  constructor(
    @InjectRepository(SportingComplex)
    private repo: Repository<SportingComplex>
  ) {}

  async findById(id: Buffer): Promise<SportingComplex | null> {
    return this.getFullObjectQuery()
      .where('SportingComplex.id = :id_sportingComplex', { id_sportingComplex: id })
      .getOne();
  }

  async update(sportingComplex: DeepPartial<SportingComplex>): Promise<SportingComplex> {
    const res = await this.repo.save(sportingComplex);
    return this.findById(res.id).then((i) => {
      if (!i) throw new InternalServerErrorException();
      return i;
    });
  }

  async countSportingComplexWithAddress(idAddress: Buffer): Promise<number> {
    return this.repo
      .createQueryBuilder('SportingComplex')
      .where('SportingComplex.address = :id', { id: idAddress })
      .getCount();
  }

  private getFullObjectQuery(): SelectQueryBuilder<SportingComplex> {
    return this.repo
      .createQueryBuilder('SportingComplex')
      .leftJoinAndSelect('SportingComplex.address', 'address')
      .leftJoinAndSelect('SportingComplex.equipments', 'equipments')
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
