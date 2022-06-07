import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { TypeOrmModule } from '@nestjs/typeorm';
import EquipmentType from 'src/models/equipmentType/equipmentType.entity';
import EquipmentTypeService from 'src/models/equipmentType/equipmentType.service';
import EquipmentTypeController from 'src/models/equipmentType/equipmentType.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EquipmentType])],
  exports: [TypeOrmModule],
  controllers: [EquipmentTypeController],
  providers: [EquipmentTypeService]
})
export default class EquipmentTypeModule {}
