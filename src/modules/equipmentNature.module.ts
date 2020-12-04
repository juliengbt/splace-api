import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { TypeOrmModule } from '@nestjs/typeorm';
import EquipmentNature from 'src/entities/equipmentNature.entity';
import EquipmentNatureService from 'src/services/equipmentNature.service';
import EquipmentNatureController from 'src/controllers/equipmentNature.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EquipmentNature])],
  exports: [TypeOrmModule],
  controllers: [EquipmentNatureController],
  providers: [EquipmentNatureService]
})
export default class EquipmentNatureModule {}
