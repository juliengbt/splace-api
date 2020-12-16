import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import CityDTO from 'src/dto/city.dto';
import CitySearchDTO from 'src/dto/city.search.dto';
import City from 'src/entities/city.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';

@Injectable()
export default class CityService {
  constructor(
    @InjectRepository(City)
    private repo: Repository<City>
  ) {}

  async findUsingDTO(cityDTO: CityDTO): Promise<CitySearchDTO[]> {
    const query = this.getFullObjectQuery();

    query.select("GROUP_CONCAT(bin_to_uuid(City.id) SEPARATOR ';') as ids")
      .addSelect('City.name as city_name')
      .addSelect('department.num as department_num')
      .groupBy('City.name')
      .addGroupBy('department.id');

    if (cityDTO.name) {
      const cityClause = 'MATCH(City.name) AGAINST (:c_name IN BOOLEAN MODE)';
      query.where(cityClause, { c_name: cityDTO.name.join(' ') })
        .orderBy(cityClause, 'DESC');
    }

    if (cityDTO.zip_code) {
      query
        .having("GROUP_CONCAT(City.zip_code SEPARATOR ' ') LIKE :zip_code", { zip_code: `%${cityDTO.zip_code}%` });
    }

    query.addOrderBy('City.name', 'ASC');

    return query.limit(5).getRawMany().then((values) => values.map((value) => {
      const citySearchDTO = new CitySearchDTO();
      citySearchDTO.ids = value.ids.split(';');
      citySearchDTO.city_name = value.city_name;
      citySearchDTO.department_num = value.department_num;
      return citySearchDTO;
    }));
  }

  async findAll(): Promise<City[]> {
    return this.getFullObjectQuery()
      .getMany();
  }

  private getFullObjectQuery(): SelectQueryBuilder<City> {
    return this.repo.createQueryBuilder('City')
      .leftJoinAndMapOne('City.department', 'City.department', 'department');
  }
}
