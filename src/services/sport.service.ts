import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Sport from 'src/entities/sport.entity';
import { Repository } from 'typeorm';

@Injectable()
export default class SportService {
  constructor(
    @InjectRepository(Sport)
    private repo: Repository<Sport>
  ) {}

  async findAll(): Promise<Sport[]> {
    return this.repo.createQueryBuilder()
      .leftJoinAndSelect('Sport.category', 'category')
      .getMany();
  }

  async findByCategory(code_category: string): Promise<Sport[]> {
    return this.repo.createQueryBuilder()
      .leftJoinAndSelect('Sport.category', 'category')
      .where('Sport.code_category like :code')
      .setParameters({ code: `%${code_category}%` })
      .getMany();
  }

  async findByCode(code_sport: string): Promise<Sport | undefined> {
    return this.repo.createQueryBuilder()
      .leftJoinAndSelect('Sport.category', 'category')
      .where('Sport.code like %:code%')
      .setParameters({ code: `%${code_sport}%` })
      .getOne();
  }
}
