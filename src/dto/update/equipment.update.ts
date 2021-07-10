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
import EquipmentLevelUpdate from './equipmentLevel.update';
import EquipmentNatureUpdate from './equipmentNature.update';
import EquipmentTypeUpdate from './equipmentType.update';
import InstallationUpdate from './installation.update';
import OwnerUpdate from './owner.update';
import PictureUpdate from './picture.update';
import SoilTypeUpdate from './soilType.update';
import SportUpdate from './sport.update';

export default class EquipmentUpdate {
  @ApiProperty({ type: () => String, required: true })
  @Type(() => String)
  @Transform(({ value }) => Buffer.from((value as string), 'base64url'))
  id!: Buffer;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  @IsOptional()
  name?: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  @IsOptional()
  @ValidateIf((_object, value) => value !== null)
  other_info?: string | null;

  @ApiProperty({ type: Boolean, required: false, nullable: true })
  @IsBoolean()
  @IsOptional()
  @ValidateIf((_object, value) => value !== null)
  open_access?: boolean | null;

  @ApiProperty({ type: Boolean, required: false, nullable: true })
  @IsBoolean()
  @IsOptional()
  @ValidateIf((_object, value) => value !== null)
  locker?: boolean | null;

  @ApiProperty({ type: Boolean, required: false, nullable: true })
  @IsBoolean()
  @IsOptional()
  @ValidateIf((_object, value) => value !== null)
  lighting?: boolean | null;

  @ApiProperty({ type: Boolean, required: false, nullable: true })
  @IsBoolean()
  @IsOptional()
  @ValidateIf((_object, value) => value !== null)
  shower?: boolean | null;

  @ApiProperty({ type: Number, required: false })
  @IsInt()
  @MaxLength(1000)
  @IsOptional()
  amount?: number;

  @ApiProperty({ type: Number, required: false })
  @IsLongitude()
  @IsOptional()
  longitude?: number;

  @ApiProperty({ type: Number, required: false })
  @IsLatitude()
  @IsOptional()
  latitude?: number;

  @ApiProperty({ type: () => InstallationUpdate, required: false, nullable: true })
  @Type(() => InstallationUpdate)
  @ValidateNested()
  @IsNotEmptyObject()
  @IsOptional()
  @ValidateIf((_object, value) => value !== null)
  installation?: InstallationUpdate | null;

  @ApiProperty({ type: () => OwnerUpdate, required: false, nullable: true })
  @Type(() => OwnerUpdate)
  @ValidateNested()
  @IsNotEmptyObject()
  @IsOptional()
  @ValidateIf((_object, value) => value !== null)
  owner?: OwnerUpdate | null;

  @ApiProperty({ type: () => SoilTypeUpdate, required: false, nullable: true })
  @Type(() => SoilTypeUpdate)
  @ValidateNested()
  @IsNotEmptyObject()
  @IsOptional()
  @ValidateIf((_object, value) => value !== null)
  soil_type?: SoilTypeUpdate | null;

  @ApiProperty({ type: () => EquipmentNatureUpdate, required: false, nullable: true })
  @Type(() => EquipmentNatureUpdate)
  @ValidateNested()
  @IsNotEmptyObject()
  @IsOptional()
  @ValidateIf((_object, value) => value !== null)
  equipment_nature?: EquipmentNatureUpdate | null;

  @ApiProperty({ type: () => EquipmentTypeUpdate, required: false, nullable: false })
  @Type(() => EquipmentTypeUpdate)
  @ValidateNested()
  @IsNotEmptyObject()
  @IsOptional()
  equipment_type?: EquipmentTypeUpdate;

  @ApiProperty({ type: () => EquipmentLevelUpdate, required: false, nullable: true })
  @Type(() => EquipmentLevelUpdate)
  @ValidateNested()
  @IsNotEmptyObject()
  @IsOptional()
  @ValidateIf((_object, value) => value !== null)
  equipment_level?: EquipmentLevelUpdate | null;

  @ApiProperty({ type: () => SportUpdate, required: false, isArray: true })
  @Type(() => SportUpdate)
  @ValidateNested({ each: true })
  @IsArray()
  @ArrayMinSize(1)
  @IsOptional()
  sports?: SportUpdate[];

  @ApiProperty({ type: () => PictureUpdate, required: false, isArray: true })
  @Type(() => PictureUpdate)
  @ValidateNested({ each: true })
  @IsArray()
  @IsOptional()
  pictures?: PictureUpdate[];
}
