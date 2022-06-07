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
import EquipmentLevelSearch from '../../equipmentLevel/dto/equipmentLevel.search';
import EquipmentNatureSearch from '../../equipmentNature/dto/equipmentNature.search';
import EquipmentTypeSearch from '../../equipmentType/dto/equipmentType.search';
import GPSAreaSearch from './gps_area.search';
import InstallationSearch from '../../installation/dto/installation.search';
import OwnerSearch from '../../owner/dto/owner.search';
// eslint-disable-next-line import/no-cycle
import SoilTypeSearch from '../../soilType/dto/soilType.search';
import SportSearch from '../../sport/dto/sport.search';

export default class EquipmentSearch {
  @ApiProperty({ type: String, required: false, isArray: true })
  @IsArray()
  @IsOptional()
  @ArrayMinSize(1, { message: 'name must contain at least $constraint1 object' })
  @IsString({ each: true, message: 'name must contains strings' })
  @MinLength(3, { each: true, message: 'Minimum length for names is $constraint1' })
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

  @ApiProperty({ type: () => GPSAreaSearch, required: false })
  @ValidateNested()
  @IsNotEmptyObject()
  @Type(() => GPSAreaSearch)
  @IsOptional()
  gps_area?: GPSAreaSearch;

  @ApiProperty({ type: () => InstallationSearch, required: false })
  @ValidateNested()
  @Type(() => InstallationSearch)
  @IsOptional()
  @IsNotEmptyObject()
  installation?: InstallationSearch | null;

  @ApiProperty({ type: () => OwnerSearch, required: false, isArray: true })
  @IsArray()
  @ArrayMinSize(1, { message: 'owner must contain at least $constraint1 object' })
  @ValidateNested({ each: true })
  @Type(() => OwnerSearch)
  @IsOptional()
  @IsNotEmptyObject({}, { each: true })
  owner?: OwnerSearch[];

  @ApiProperty({ type: () => SoilTypeSearch, required: false, isArray: true })
  @IsArray()
  @ArrayMinSize(1, { message: 'soil_type must contain at least $constraint1 object' })
  @ValidateNested({ each: true })
  @Type(() => SoilTypeSearch)
  @IsOptional()
  @IsNotEmptyObject({}, { each: true })
  soil_type?: SoilTypeSearch[];

  @ApiProperty({ type: () => EquipmentNatureSearch, required: false, isArray: true })
  @IsArray()
  @ArrayMinSize(1, { message: 'equipment_nature must contain at least $constraint1 object' })
  @ValidateNested({ each: true })
  @Type(() => EquipmentNatureSearch)
  @IsOptional()
  @IsNotEmptyObject({}, { each: true })
  equipment_nature?: EquipmentNatureSearch[];

  @ApiProperty({ type: () => EquipmentTypeSearch, required: false, isArray: true })
  @IsArray()
  @ArrayMinSize(1, { message: 'equipment_type must contain at least $constraint1 object' })
  @ValidateNested({ each: true })
  @Type(() => EquipmentTypeSearch)
  @IsOptional()
  @IsNotEmptyObject({}, { each: true })
  equipment_type?: EquipmentTypeSearch[];

  @ApiProperty({ type: () => EquipmentLevelSearch, required: false, isArray: true })
  @IsArray()
  @ArrayMinSize(1, { message: 'equipment_level must contain at least $constraint1 object' })
  @ValidateNested({ each: true })
  @Type(() => EquipmentLevelSearch)
  @IsOptional()
  @IsNotEmptyObject({}, { each: true })
  equipment_level?: EquipmentLevelSearch[] | null;

  @ApiProperty({ type: () => SportSearch, required: false, isArray: true })
  @IsArray()
  @ArrayMinSize(1, { message: 'sports must contain at least $constraint1 object' })
  @ValidateNested({ each: true })
  @Type(() => SportSearch)
  @IsOptional()
  @Type(() => SportSearch)
  @IsNotEmptyObject({}, { each: true })
  sports?: SportSearch[];

  @ApiProperty({ type: () => Number, required: false })
  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating?: number | null;
}
