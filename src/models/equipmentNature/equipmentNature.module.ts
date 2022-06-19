import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { TypeOrmModule } from '@nestjs/typeorm';
import EquipmentNature from 'src/models/equipmentNature/equipmentNature.entity';
import EquipmentNatureService from 'src/models/equipmentNature/equipmentNature.service';

@Module({
  imports: [TypeOrmModule.forFeature([EquipmentNature])],
  exports: [EquipmentNatureService],
  controllers: [],
  providers: [EquipmentNatureService]
})
export default class EquipmentNatureModule {}
