import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray, IsBoolean, IsInt, IsLatitude, IsLongitude, IsOptional, IsUUID, Max, Min, ValidateNested
} from 'class-validator';
import EquipmentLevelDTO from './equipmentLevel.dto';
import EquipmentNatureDTO from './equipmentNature.dto';
import EquipmentTypeDTO from './equipmentType.dto';
import GPSAreaDTO from './gps_area.dto';
import InstallationDTO from './installation.dto';
import OwnerDTO from './owner.dto';
// eslint-disable-next-line import/no-cycle
import PictureDTO from './picture.dto';
import SoilTypeDTO from './soilType.dto';
import SportDTO from './sport.dto';

export default class EquipmentDTO {
  @ApiProperty({ type: String, required: false })
  @IsUUID()
  @IsOptional()
  id?: string;

  @ApiProperty({ type: String, required: false })
  name?: string;

  @ApiProperty({ type: String, required: false })
  other_info?: string | null;

  @ApiProperty({ type: Boolean, required: false })
  @IsOptional()
  @IsBoolean()
  open_access?: boolean | null;

  @ApiProperty({ type: Boolean, required: false })
  @IsOptional()
  @IsBoolean()
  locker?: boolean | null;

  @ApiProperty({ type: Boolean, required: false })
  @IsOptional()
  @IsBoolean()
  lighting?: boolean | null;

  @ApiProperty({ type: Boolean, required: false })
  @IsOptional()
  @IsBoolean()
  shower?: boolean | null;

  @ApiProperty({ type: Number, required: false })
  amount?: number;

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
  installation?: InstallationDTO | null;

  @ApiProperty({ type: () => OwnerDTO, required: false, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  owner?: OwnerDTO[] | null;

  @ApiProperty({ type: () => SoilTypeDTO, required: false, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  soil_type?: SoilTypeDTO[] | null;

  @ApiProperty({ type: () => EquipmentNatureDTO, required: false, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  equipment_nature?: EquipmentNatureDTO[] | null;

  @ApiProperty({ type: () => EquipmentTypeDTO, required: false, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  equipment_type?: EquipmentTypeDTO[] | null;

  @ApiProperty({ type: () => EquipmentLevelDTO, required: false, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  equipment_level?: EquipmentLevelDTO[] | null;

  @ApiProperty({ type: () => SportDTO, required: false, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => SportDTO)
  sports?: SportDTO[];

  @ApiProperty({ type: () => PictureDTO, required: false, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => PictureDTO)
  pictures?: PictureDTO[];

  @ApiProperty({ type: () => Number, required: false })
  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating?: number | null;

  @ApiProperty({ type: () => Number, required: false })
  distance?: number;
}
