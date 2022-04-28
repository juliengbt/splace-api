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
import Default from 'src/decorators/default';
import EquipmentLevelCreate from './equipmentLevel.create';
import EquipmentNatureCreate from './equipmentNature.create';
import EquipmentTypeCreate from './equipmentType.create';
import InstallationCreate from './installation.create';
import OwnerCreate from './owner.create';
import SoilTypeCreate from './soilType.create';
import SportCreate from './sport.create';

export default class EquipmentCreate {
  @ApiProperty({ type: () => String, required: false })
  @Type(() => String)
  @Transform(({ value }) => (value ? Buffer.from(value as string, 'base64url') : undefined))
  id?: Buffer;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name!: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  @IsOptional()
  @Default(null)
  @ValidateIf((_object, value) => value !== null)
  other_info?: string | null;

  @ApiProperty({ type: Boolean, required: false, nullable: true })
  @IsBoolean()
  @IsOptional()
  @Default(null)
  @ValidateIf((_object, value) => value !== null)
  open_access?: boolean | null;

  @ApiProperty({ type: Boolean, required: false, nullable: true })
  @IsBoolean()
  @IsOptional()
  @Default(null)
  @ValidateIf((_object, value) => value !== null)
  locker?: boolean | null;

  @ApiProperty({ type: Boolean, required: false, nullable: true })
  @IsBoolean()
  @IsOptional()
  @Default(null)
  @ValidateIf((_object, value) => value !== null)
  lighting?: boolean | null;

  @ApiProperty({ type: Boolean, required: false, nullable: true })
  @IsBoolean()
  @IsOptional()
  @Default(null)
  @ValidateIf((_object, value) => value !== null)
  shower?: boolean | null;

  @ApiProperty({ type: Number, required: false })
  @IsInt()
  @MaxLength(1000)
  @IsOptional()
  @Default(1)
  amount?: number;

  @ApiProperty({ type: Number, required: true })
  @IsLongitude()
  longitude?: number;

  @ApiProperty({ type: Number, required: true })
  @IsLatitude()
  latitude?: number;

  @ApiProperty({ type: () => InstallationCreate, required: false, nullable: true })
  @Type(() => InstallationCreate)
  @ValidateNested()
  @IsNotEmptyObject()
  @IsOptional()
  @Default(null)
  @ValidateIf((_object, value) => value !== null)
  installation?: InstallationCreate | null;

  @ApiProperty({ type: () => OwnerCreate, required: false, nullable: true })
  @Type(() => OwnerCreate)
  @ValidateNested()
  @IsNotEmptyObject()
  @IsOptional()
  @Default(null)
  @ValidateIf((_object, value) => value !== null)
  owner?: OwnerCreate | null;

  @ApiProperty({ type: () => SoilTypeCreate, required: false, nullable: true })
  @Type(() => SoilTypeCreate)
  @ValidateNested()
  @IsNotEmptyObject()
  @IsOptional()
  @Default(null)
  @ValidateIf((_object, value) => value !== null)
  soil_type?: SoilTypeCreate | null;

  @ApiProperty({ type: () => EquipmentNatureCreate, required: false, nullable: true })
  @Type(() => EquipmentNatureCreate)
  @ValidateNested()
  @IsNotEmptyObject()
  @IsOptional()
  @Default(null)
  @ValidateIf((_object, value) => value !== null)
  equipment_nature?: EquipmentNatureCreate | null;

  @ApiProperty({ type: () => EquipmentTypeCreate, required: true, nullable: false })
  @Type(() => EquipmentTypeCreate)
  @ValidateNested()
  @IsNotEmptyObject()
  equipment_type!: EquipmentTypeCreate;

  @ApiProperty({ type: () => EquipmentLevelCreate, required: false, nullable: true })
  @Type(() => EquipmentLevelCreate)
  @ValidateNested()
  @IsNotEmptyObject()
  @IsOptional()
  @Default(null)
  @ValidateIf((_object, value) => value !== null)
  equipment_level?: EquipmentLevelCreate | null;

  @ApiProperty({ type: () => SportCreate, required: true, isArray: true })
  @Type(() => SportCreate)
  @ValidateNested({ each: true })
  @IsArray()
  @ArrayMinSize(1)
  sports!: SportCreate[];
}
