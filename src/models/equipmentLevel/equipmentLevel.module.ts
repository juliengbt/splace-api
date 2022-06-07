import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { TypeOrmModule } from '@nestjs/typeorm';
import EquipmentLevel from 'src/models/equipmentLevel/equipmentLevel.entity';
import EquipmentLevelService from 'src/models/equipmentLevel/equipmentLevel.service';
import EquipmentLevelController from 'src/models/equipmentLevel/equipmentLevel.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EquipmentLevel])],
  exports: [TypeOrmModule],
  controllers: [EquipmentLevelController],
  providers: [EquipmentLevelService]
})
export default class EquipmentLevelModule {}
