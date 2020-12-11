import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsInt,
  IsLatitude,
  IsLongitude,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
  ValidateNested
} from 'class-validator';
import EquipmentLevelDTO from './equipmentLevel.dto';
import EquipmentNatureDTO from './equipmentNature.dto';
import EquipmentTypeDTO from './equipmentType.dto';
import GPSAreaDTO from './gps_area.dto';
import InstallationDTO from './installation.dto';
import OwnerDTO from './owner.dto';
// eslint-disable-next-line import/no-cycle
import SoilTypeDTO from './soilType.dto';
import SportDTO from './sport.dto';

export default class EquipmentDTO {
  @ApiProperty({ type: String, required: false, isArray: true })
  @IsArray()
  @IsOptional()
  @ArrayMinSize(1, { message: 'name must contain at least one object' })
  @IsString({ each: true, message: 'name must contains strings' })
  @MinLength(3, { each: true, message: 'Minimum length for names is $value' })
  name?: string[];

  @ApiProperty({ type: Boolean, required: false })
  @IsOptional()
  @IsBoolean({ message: 'open_access must be a boolean value' })
  open_access?: boolean | null;

  @ApiProperty({ type: Boolean, required: false })
  @IsOptional()
  @IsBoolean({ message: 'locker must be a boolean value' })
  locker?: boolean | null;

  @ApiProperty({ type: Boolean, required: false })
  @IsOptional()
  @IsBoolean({ message: 'lighting must be a boolean value' })
  lighting?: boolean | null;

  @ApiProperty({ type: Boolean, required: false })
  @IsOptional()
  @IsBoolean({ message: 'shower must be a boolean value' })
  shower?: boolean | null;

  @ApiProperty({ type: Number, required: false })
  @IsLatitude()
  @IsOptional()
  latitude?: number;

  @ApiProperty({ type: Number, required: false })
  @IsLongitude()
  @IsOptional()
  longitude?: number;

  @ApiProperty({ type: () => GPSAreaDTO, required: false })
  @ValidateNested()
  @IsOptional()
  gps_area?: GPSAreaDTO;

  @ApiProperty({ type: () => InstallationDTO, required: false })
  @ValidateNested()
  @IsOptional()
  @IsNotEmptyObject()
  installation?: InstallationDTO | null;

  @ApiProperty({ type: () => OwnerDTO, required: false, isArray: true })
  @IsArray()
  @ArrayMinSize(1, { message: 'owner must contain at least one object' })
  @ValidateNested({ each: true })
  @IsOptional()
  @IsNotEmptyObject({ each: true })
  owner?: OwnerDTO[];

  @ApiProperty({ type: () => SoilTypeDTO, required: false, isArray: true })
  @IsArray()
  @ArrayMinSize(1, { message: 'soil_type must contain at least one object' })
  @ValidateNested({ each: true })
  @IsOptional()
  @IsNotEmptyObject({ each: true })
  soil_type?: SoilTypeDTO[];

  @ApiProperty({ type: () => EquipmentNatureDTO, required: false, isArray: true })
  @IsArray()
  @ArrayMinSize(1, { message: 'equipment_nature must contain at least one object' })
  @ValidateNested({ each: true })
  @IsOptional()
  @IsNotEmptyObject({ each: true })
  equipment_nature?: EquipmentNatureDTO[];

  @ApiProperty({ type: () => EquipmentTypeDTO, required: false, isArray: true })
  @IsArray()
  @ArrayMinSize(1, { message: 'equipment_type must contain at least one object' })
  @ValidateNested({ each: true })
  @IsOptional()
  @IsNotEmptyObject({ each: true })
  equipment_type?: EquipmentTypeDTO[];

  @ApiProperty({ type: () => EquipmentLevelDTO, required: false, isArray: true })
  @IsArray()
  @ArrayMinSize(1, { message: 'equipment_level must contain at least one object' })
  @ValidateNested({ each: true })
  @IsOptional()
  @IsNotEmptyObject({ each: true })
  equipment_level?: EquipmentLevelDTO[] | null;

  @ApiProperty({ type: () => SportDTO, required: false, isArray: true })
  @IsArray()
  @ArrayMinSize(1, { message: 'sports must contain at least one object' })
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => SportDTO)
  @IsNotEmptyObject({ each: true })
  sports?: SportDTO[];

  @ApiProperty({ type: () => Number, required: false })
  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating?: number | null;
}
