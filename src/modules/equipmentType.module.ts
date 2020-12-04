import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { TypeOrmModule } from '@nestjs/typeorm';
import EquipmentType from 'src/entities/equipmentType.entity';
import EquipmentTypeService from 'src/services/equipmentType.service';
import EquipmentTypeController from 'src/controllers/equipmentType.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EquipmentType])],
  exports: [TypeOrmModule],
  controllers: [EquipmentTypeController],
  providers: [EquipmentTypeService]
})
export default class EquipmentTypeModule {}
