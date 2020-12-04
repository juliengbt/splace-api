import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Owner from 'src/entities/owner.entity';
import { Repository } from 'typeorm';

@Injectable()
export default class OwnerService {
  constructor(
    @InjectRepository(Owner)
    private repo: Repository<Owner>
  ) {}

  async findAll(): Promise<Owner[]> {
    return this.repo.createQueryBuilder()
      .getMany();
  }
}
