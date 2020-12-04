import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import EquipmentType from 'src/entities/equipmentType.entity';
import { Repository } from 'typeorm';

@Injectable()
export default class EquipmentTypeService {
  constructor(
    @InjectRepository(EquipmentType)
    private categoryRepo: Repository<EquipmentType>
  ) {}

  async findAll(): Promise<EquipmentType[]> {
    return this.categoryRepo.createQueryBuilder()
      .getMany();
  }
}
