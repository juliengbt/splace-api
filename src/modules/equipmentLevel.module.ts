import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { TypeOrmModule } from '@nestjs/typeorm';
import EquipmentLevel from 'src/entities/equipmentLevel.entity';
import EquipmentLevelService from 'src/services/equipmentLevel.service';
import EquipmentLevelController from 'src/controllers/equipmentLevel.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EquipmentLevel])],
  exports: [TypeOrmModule],
  controllers: [EquipmentLevelController],
  providers: [EquipmentLevelService]
})
export default class EquipmentLevelModule {}
