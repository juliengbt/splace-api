import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import SoilType from 'src/entities/soilType.entity';
import { Repository } from 'typeorm';

@Injectable()
export default class SoilTypeService {
  constructor(
    @InjectRepository(SoilType)
    private repo: Repository<SoilType>
  ) {}

  async findAll(): Promise<SoilType[]> {
    return this.repo.createQueryBuilder().getMany();
  }
}
