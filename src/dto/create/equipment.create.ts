import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
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
import IsCustomUUID from 'src/validators/uuid.validator';
import EquipmentLevelCreate from './equipmentLevel.create';
import EquipmentNatureCreate from './equipmentNature.create';
import EquipmentTypeCreate from './equipmentType.create';
import InstallationCreate from './installation.create';
import OwnerCreate from './owner.create';
import PictureCreate from './picture.create';
import SoilTypeCreate from './soilType.create';
import SportCreate from './sport.create';

export default class EquipmentCreate {
  @ApiProperty({ type: String, required: false })
  @Type(() => String)
  @IsCustomUUID()
  @IsOptional()
  @Transform(({ value }) => Buffer.from((value as string), 'base64url'))
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

  @ApiProperty({ type: () => InstallationCreate, required: true })
  @Type(() => InstallationCreate)
  @ValidateNested()
  @IsNotEmptyObject()
  installation!: InstallationCreate;

  @ApiProperty({ type: () => OwnerCreate, required: true })
  @Type(() => OwnerCreate)
  @ValidateNested()
  @IsNotEmptyObject()
  @ValidateIf((_object, value) => value !== null)
  owner!: OwnerCreate | null;

  @ApiProperty({ type: () => SoilTypeCreate, required: true })
  @Type(() => SoilTypeCreate)
  @ValidateNested()
  @IsNotEmptyObject()
  @ValidateIf((_object, value) => value !== null)
  soil_type!: SoilTypeCreate | null;

  @ApiProperty({ type: () => EquipmentNatureCreate, required: true })
  @Type(() => EquipmentNatureCreate)
  @ValidateNested()
  @IsNotEmptyObject()
  @ValidateIf((_object, value) => value !== null)
  equipment_nature!: EquipmentNatureCreate | null;

  @ApiProperty({ type: () => EquipmentTypeCreate, required: true })
  @Type(() => EquipmentTypeCreate)
  @ValidateNested()
  @IsNotEmptyObject()
  @ValidateIf((_object, value) => value !== null)
  equipment_type!: EquipmentTypeCreate | null;

  @ApiProperty({ type: () => EquipmentLevelCreate, required: true })
  @Type(() => EquipmentLevelCreate)
  @ValidateNested()
  @IsNotEmptyObject()
  @ValidateIf((_object, value) => value !== null)
  equipment_level!: EquipmentLevelCreate | null;

  @ApiProperty({ type: () => SportCreate, required: true, isArray: true })
  @Type(() => SportCreate)
  @ValidateNested({ each: true })
  @IsArray()
  @IsNotEmptyObject()
  @ArrayMinSize(1)
  sports!: SportCreate[];

  @ApiProperty({ type: () => PictureCreate, required: true, isArray: true })
  @Type(() => PictureCreate)
  @ValidateNested({ each: true })
  @IsArray()
  @IsNotEmptyObject()
  @ValidateIf((_object, value) => value && value.length > 0)
  pictures!: PictureCreate[];
}
