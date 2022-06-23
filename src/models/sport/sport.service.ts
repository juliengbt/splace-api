import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Sport from 'src/models/sport/sport.entity';
import { Repository } from 'typeorm';

@Injectable()
export default class SportService {
  constructor(
    @InjectRepository(Sport)
    private repo: Repository<Sport>
  ) {}

  async findAll(): Promise<Sport[]> {
    return this.repo.find();
  }

  async findByCategory(code_category: string): Promise<Sport[]> {
    return this.repo.find({ where: { category: { code: code_category } } });
  }

  async findByCode(code_sport: string): Promise<Sport | null> {
    return this.repo.findOne({ where: { code: code_sport } });
  }
}
