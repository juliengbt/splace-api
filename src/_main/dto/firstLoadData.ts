import { ApiProperty } from '@nestjs/swagger';
import EquipmentLevel from 'src/models/equipmentLevel/equipmentLevel.entity';
import EquipmentNature from 'src/models/equipmentNature/equipmentNature.entity';
import EquipmentType from 'src/models/equipmentType/equipmentType.entity';
import Owner from 'src/models/owner/owner.entity';
import SoilType from 'src/models/soilType/soilType.entity';
import Sport from 'src/models/sport/sport.entity';

export class FirstLoadData {
  @ApiProperty({ type: EquipmentLevel, isArray: true })
  equipmentLevels!: EquipmentLevel[];

  @ApiProperty({ type: EquipmentNature, isArray: true })
  equipmentNatures!: EquipmentNature[];

  @ApiProperty({ type: EquipmentType, isArray: true })
  equipmentTypes!: EquipmentType[];

  @ApiProperty({ type: Owner, isArray: true })
  owners!: Owner[];

  @ApiProperty({ type: SoilType, isArray: true })
  soilTypes!: SoilType[];

  @ApiProperty({ type: Sport, isArray: true })
  sports!: Sport[];
}
