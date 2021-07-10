import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import CityDTO from 'src/dto/search/city.dto';
import Zipcode from 'src/entities/zipcode.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';

@Injectable()
export default class ZipcodeService {
  constructor(
    @InjectRepository(Zipcode)
    private repo: Repository<Zipcode>
  ) {}

  async findOne(cityDTO: CityDTO) : Promise<Zipcode | undefined> {
    const query = this.getFullObjectQuery();

    if (cityDTO.zipcode) {
      query.where('Zipcode.code = :zip_code', { zip_code: `${cityDTO.zipcode}` });
    }

    if (cityDTO.names) {
      const cityClause = 'MATCH(city.name) AGAINST (:c_name IN BOOLEAN MODE)';
      query.where(cityClause, { c_name: cityDTO.names.join(' ') })
        .addSelect(`${cityClause}`, 'keyword_rank')
        .orderBy('keyword_rank', 'DESC');
    }

    query.addSelect('LENGTH(city.name)', 'len_name')
      .addOrderBy('len_name', 'ASC')
      .addOrderBy('city.name', 'ASC');
    return query.getOne();
  }

  private getFullObjectQuery(): SelectQueryBuilder<Zipcode> {
    return this.repo.createQueryBuilder('Zipcode')
      .leftJoinAndMapOne('Zipcode.city', 'Zipcode.city', 'city')
      .leftJoinAndMapOne('city.department', 'city.department', 'department');
  }
}
