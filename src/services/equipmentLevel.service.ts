import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import EquipmentLevel from 'src/entities/equipmentLevel.entity';
import { Repository } from 'typeorm';

@Injectable()
export default class EquipmentLevelService {
  constructor(
    @InjectRepository(EquipmentLevel)
    private repo: Repository<EquipmentLevel>
  ) {}

  async findAll(): Promise<EquipmentLevel[]> {
    return this.repo.createQueryBuilder().getMany();
  }
}
