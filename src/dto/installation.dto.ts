import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray, IsBoolean, IsOptional, ValidateNested
} from 'class-validator';
import AddressDTO from './address.dto';
import CityDTO from './city.dto';

export default class InstallationDTO {
  @ApiProperty({ type: () => String, isArray: true, required: false })
  @IsArray({ message: 'name must in an string array' })
  @ArrayMinSize(1, { message: 'name must contain at least one object' })
  @IsOptional()
  name?: string[];

  @ApiProperty({ type: () => Boolean, required: false })
  @IsBoolean({ message: 'car_park must be a boolean value' })
  @IsOptional()
  car_park?: boolean | null;

  @ApiProperty({ type: () => Boolean, required: false })
  @IsBoolean({ message: 'disabled_access must be a boolean value' })
  @IsOptional()
  disabled_access?: boolean | null;

  @ApiProperty({ type: () => AddressDTO, required: false })
  @ValidateNested()
  @IsOptional()
  address?: AddressDTO | null;

  @ApiProperty({ type: () => CityDTO, required: false })
  @ValidateNested()
  @IsOptional()
  city?: CityDTO | null;
}
