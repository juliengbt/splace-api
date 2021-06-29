import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import CityDTO from 'src/dto/search/city.dto';
import City from 'src/entities/city.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';

@Injectable()
export default class CityService {
  constructor(
    @InjectRepository(City)
    private repo: Repository<City>
  ) {}

  async findUsingDTO(cityDTO: CityDTO): Promise<City[]> {
    return this.find(cityDTO).take(15).getMany();
  }

  async findOneUsingDTO(cityDTO: CityDTO): Promise<City | undefined> {
    return this.find(cityDTO).getOne();
  }

  private find(cityDTO: CityDTO) : SelectQueryBuilder<City> {
    const query = this.getFullObjectQuery();

    if (cityDTO.names) {
      const cityClause = 'MATCH(City.name) AGAINST (:c_name IN BOOLEAN MODE)';
      query.where(cityClause, { c_name: cityDTO.names.join(' ') })
        .addSelect(`${cityClause}`, 'keyword_rank')
        .orderBy('keyword_rank', 'DESC');
    }

    if (cityDTO.zipcode) {
      query.where('zipcodes.code = :zip_code', { zip_code: `${cityDTO.zipcode}` });
    }

    query.addSelect('LENGTH(City.name)', 'len_name')
      .addOrderBy('len_name', 'ASC')
      .addOrderBy('City.name', 'ASC');
    return query;
  }

  async findAll(): Promise<City[]> {
    return this.getFullObjectQuery()
      .getMany();
  }

  async findById(id: Buffer): Promise<City | undefined> {
    return this.getFullObjectQuery()
      .where('City.id = :id_city')
      .setParameters({ id_city: id })
      .getOne();
  }

  private getFullObjectQuery(): SelectQueryBuilder<City> {
    return this.repo.createQueryBuilder('City')
      .leftJoinAndMapOne('City.department', 'City.department', 'department')
      .leftJoinAndMapMany('City.zipcodes', 'City.zipcodes', 'zipcodes');
  }
}
