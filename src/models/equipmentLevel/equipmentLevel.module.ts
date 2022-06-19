import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { TypeOrmModule } from '@nestjs/typeorm';
import EquipmentLevel from 'src/models/equipmentLevel/equipmentLevel.entity';
import EquipmentLevelService from 'src/models/equipmentLevel/equipmentLevel.service';

@Module({
  imports: [TypeOrmModule.forFeature([EquipmentLevel])],
  exports: [EquipmentLevelService],
  controllers: [],
  providers: [EquipmentLevelService]
})
export default class EquipmentLevelModule {}
