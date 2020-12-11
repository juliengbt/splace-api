import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import CityDTO from 'src/dto/city.dto';
import City from 'src/entities/city.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';

@Injectable()
export default class OwnerService {
  constructor(
    @InjectRepository(City)
    private repo: Repository<City>
  ) {}

  async findUsingDTO(cityDTO: CityDTO): Promise<City[]> {
    const query = this.getFullObjectQuery();

    if (cityDTO.name) {
      const cityClause = 'MATCH(City.name) AGAINST (:c_name IN BOOLEAN MODE)';
      query.where(cityClause, { c_name: cityDTO.name.join(' ') })
        .orderBy(cityClause, 'DESC');
    }

    if (cityDTO.zip_code) {
      query.orWhere('City.zip_code = :zip_code', { zip_code: cityDTO.zip_code });
    }

    return query.limit(5).getMany();
  }

  async findAll(): Promise<City[]> {
    return this.getFullObjectQuery()
      .getMany();
  }

  private getFullObjectQuery(): SelectQueryBuilder<City> {
    return this.repo.createQueryBuilder('City')
      .leftJoinAndMapOne('city.department', 'city.department', 'department');
  }
}
