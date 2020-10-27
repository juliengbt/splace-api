import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Category from 'src/entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export default class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>
  ) {}

  async findAll(): Promise<Category[]> {
    return this.categoryRepo.createQueryBuilder()
      .leftJoinAndSelect('Category.sports', 'sports')
      .getMany();
  }
}
