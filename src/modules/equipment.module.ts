import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { TypeOrmModule } from '@nestjs/typeorm';
import EquipmentController from 'src/controllers/equipment.controller';
import Equipment from 'src/entities/equipment.entity';
import EquipmentService from 'src/services/equipment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Equipment])],
  exports: [TypeOrmModule],
  controllers: [EquipmentController],
  providers: [EquipmentService]
})
export default class EquipmentModule {}
