import { Module } from '@nestjs/common';
import EquipmentLevelModule from 'src/models/equipmentLevel/equipmentLevel.module';
import EquipmentNatureModule from 'src/models/equipmentNature/equipmentNature.module';
import EquipmentTypeModule from 'src/models/equipmentType/equipmentType.module';
import OwnerModule from 'src/models/owner/owner.module';
import SoilTypeModule from 'src/models/soilType/soilType.module';
import SportModule from 'src/models/sport/sport.module';
import { MainController } from './_main.controller';

@Module({
  imports: [
    EquipmentNatureModule,
    EquipmentLevelModule,
    EquipmentTypeModule,
    OwnerModule,
    SoilTypeModule,
    SportModule
  ],
  providers: [],
  controllers: [MainController],
  exports: []
})
export class MainModule {}
