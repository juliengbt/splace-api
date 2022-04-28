import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import EquipmentNature from 'src/entities/equipmentNature.entity';
import { Repository } from 'typeorm';

@Injectable()
export default class EquipmentNatureService {
  constructor(
    @InjectRepository(EquipmentNature)
    private repo: Repository<EquipmentNature>
  ) {}

  async findAll(): Promise<EquipmentNature[]> {
    return this.repo.createQueryBuilder().getMany();
  }
}
