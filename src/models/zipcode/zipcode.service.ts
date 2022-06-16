import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import CitySearch from 'src/models/city/dto/city.search';
import Zipcode from 'src/models/zipcode/zipcode.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';

@Injectable()
export default class ZipcodeService {
  constructor(
    @InjectRepository(Zipcode)
    private repo: Repository<Zipcode>
  ) {}

  async findOne(cityDTO: CitySearch): Promise<Zipcode | null> {
    const query = this.getFullObjectQuery();

    if (cityDTO.zipcode) {
      query.where('Zipcode.code = :zip_code', { zip_code: `${cityDTO.zipcode}` });
    }

    if (cityDTO.names) {
      const cityClause = 'MATCH(city.name) AGAINST (:c_name IN BOOLEAN MODE)';
      query
        .where(cityClause, { c_name: cityDTO.names.join(' ') })
        .addSelect(`${cityClause}`, 'keyword_rank')
        .orderBy('keyword_rank', 'DESC');
    }

    query
      .addSelect('LENGTH(city.name)', 'len_name')
      .addOrderBy('len_name', 'ASC')
      .addOrderBy('city.name', 'ASC');
    return query.getOne();
  }

  private getFullObjectQuery(): SelectQueryBuilder<Zipcode> {
    return this.repo
      .createQueryBuilder('Zipcode')
      .leftJoinAndMapOne('Zipcode.city', 'Zipcode.city', 'city')
      .leftJoinAndMapOne('city.department', 'city.department', 'department');
  }
}
