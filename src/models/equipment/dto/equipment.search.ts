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
  Length,
  Max,
  Min,
  MinLength,
  ValidateNested
} from 'class-validator';
import GPSAreaSearch from './gps_area.search';
import InstallationSearch from '../../installation/dto/installation.search';

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

  @ApiProperty({ type: String, required: false, isArray: true })
  @IsArray()
  @ArrayMinSize(1, { message: 'owner must contain at least $constraint1 object' })
  @Length(3, 10, {
    message: 'Owner code must be between $constraint1 and $constraint2 characters',
    each: true
  })
  @IsOptional()
  owner?: string[];

  @ApiProperty({ type: String, required: false, isArray: true })
  @IsArray()
  @ArrayMinSize(1, { message: 'soil_type must contain at least $constraint1 object' })
  @Length(3, 10, {
    message: 'SoilType code must be between $constraint1 and $constraint2 characters',
    each: true
  })
  @IsOptional()
  soil_type?: string[];

  @ApiProperty({ type: String, required: false, isArray: true })
  @IsArray()
  @ArrayMinSize(1, { message: 'equipment_nature must contain at least $constraint1 object' })
  @Length(3, 10, {
    message: 'EquipmentNature code must be between $constraint1 and $constraint2 characters',
    each: true
  })
  @IsOptional()
  equipment_nature?: string[];

  @ApiProperty({ type: String, required: false, isArray: true })
  @IsArray()
  @ArrayMinSize(1, { message: 'equipment_type must contain at least $constraint1 object' })
  @Length(3, 10, {
    message: 'EquipmentType code must be between $constraint1 and $constraint2 characters',
    each: true
  })
  @IsOptional()
  equipment_type?: string[];

  @ApiProperty({ type: String, required: false, isArray: true })
  @IsArray()
  @ArrayMinSize(1, { message: 'equipment_level must contain at least $constraint1 object' })
  @Length(3, 10, {
    message: 'EquipmentLevel code must be between $constraint1 and $constraint2 characters',
    each: true
  })
  @IsOptional()
  equipment_level?: string[] | null;

  @ApiProperty({ type: String, required: false, isArray: true })
  @IsArray()
  @ArrayMinSize(1, { message: 'sports must contain at least $constraint1 object' })
  @Length(3, 10, {
    message: 'Sport code must be between $constraint1 and $constraint2 characters',
    each: true
  })
  @IsOptional()
  sports?: string[];

  @ApiProperty({ type: () => Number, required: false })
  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating?: number | null;
}
