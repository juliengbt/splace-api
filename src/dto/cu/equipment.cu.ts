import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsInt,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
  ValidateNested
} from 'class-validator';
import IsCustomUUID from 'src/validators/uuid.validators';
import EquipmentLevelCU from './equipmentLevel.cu';
import EquipmentNatureCU from './equipmentNature.cu';
import EquipmentTypeCU from './equipmentType.cu';
import InstallationCU from './installation.cu';
import OwnerCU from './owner.cu';
import PictureCU from './picture.cu';
import SoilTypeCU from './soilType.cu';
import SportCU from './sport.cu';

export default class EquipmentCU {
  @ApiProperty({ type: String, required: false })
  @IsCustomUUID()
  @IsOptional()
  id?: Buffer;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name!: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  @ValidateIf((_object, value) => value !== null)
  other_info!: string | null;

  @ApiProperty({ type: Boolean, required: true })
  @IsBoolean()
  @ValidateIf((_object, value) => value !== null)
  open_access!: boolean | null;

  @ApiProperty({ type: Boolean, required: true })
  @IsBoolean()
  @ValidateIf((_object, value) => value !== null)
  locker!: boolean | null;

  @ApiProperty({ type: Boolean, required: true })
  @IsBoolean()
  @ValidateIf((_object, value) => value !== null)
  lighting!: boolean | null;

  @ApiProperty({ type: Boolean, required: true })
  @IsBoolean()
  @ValidateIf((_object, value) => value !== null)
  shower!: boolean | null;

  @ApiProperty({ type: Number, required: true })
  @IsInt()
  @MaxLength(1000)
  amount!: number;

  @ApiProperty({ type: Number, required: true })
  @IsLongitude()
  longitude!: number;

  @ApiProperty({ type: Number, required: true })
  @IsLatitude()
  latitude!: number;

  @ApiProperty({ type: () => InstallationCU, required: true })
  installation!: InstallationCU;

  @ApiProperty({ type: () => OwnerCU, required: true })
  @Type(() => OwnerCU)
  @ValidateNested()
  @IsNotEmptyObject()
  @ValidateIf((_object, value) => value !== null)
  owner!: OwnerCU | null;

  @ApiProperty({ type: () => SoilTypeCU, required: true })
  @Type(() => SoilTypeCU)
  @ValidateNested()
  @IsNotEmptyObject()
  @ValidateIf((_object, value) => value !== null)
  soil_type!: SoilTypeCU | null;

  @ApiProperty({ type: () => EquipmentNatureCU, required: true })
  @Type(() => EquipmentNatureCU)
  @ValidateNested()
  @IsNotEmptyObject()
  @ValidateIf((_object, value) => value !== null)
  equipment_nature!: EquipmentNatureCU | null;

  @ApiProperty({ type: () => EquipmentTypeCU, required: true })
  @Type(() => EquipmentTypeCU)
  @ValidateNested()
  @IsNotEmptyObject()
  @ValidateIf((_object, value) => value !== null)
  equipment_type!: EquipmentTypeCU | null;

  @ApiProperty({ type: () => EquipmentLevelCU, required: true })
  @Type(() => EquipmentLevelCU)
  @ValidateNested()
  @IsNotEmptyObject()
  @ValidateIf((_object, value) => value !== null)
  equipment_level!: EquipmentLevelCU | null;

  @ApiProperty({ type: () => SportCU, required: true, isArray: true })
  @Type(() => SportCU)
  @ValidateNested({ each: true })
  @IsArray()
  @IsNotEmptyObject()
  @ArrayMinSize(1)
  sports!: SportCU[];

  @ApiProperty({ type: () => PictureCU, required: true, isArray: true })
  @Type(() => PictureCU)
  @ValidateNested({ each: true })
  @IsArray()
  @IsNotEmptyObject()
  @ValidateIf((_object, value) => value && value.length > 0)
  pictures!: PictureCU[];
}
