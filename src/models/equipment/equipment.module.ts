import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { TypeOrmModule } from '@nestjs/typeorm';
import EquipmentController from 'src/models/equipment/equipment.controller';
import Equipment from 'src/models/equipment/equipment.entity';
import EquipmentService from 'src/models/equipment/equipment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Equipment])],
  exports: [EquipmentService],
  controllers: [EquipmentController],
  providers: [EquipmentService]
})
export default class EquipmentModule {}
