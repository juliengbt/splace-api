import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray, IsBoolean, IsNotEmptyObject, IsOptional, MinLength, ValidateNested
} from 'class-validator';
import CityDTO from './city.dto';
import CitySearchDTO from './city.search.dto';

export default class InstallationDTO {
  @ApiProperty({ type: () => String, isArray: true, required: false })
  @IsArray({ message: 'name must in an string array' })
  @ArrayMinSize(1, { message: 'name must contain at least $constraint1 object' })
  @IsOptional()
  @MinLength(3, { each: true, message: 'Minimum length for names is $constraint1' })
  name?: string[];

  @ApiProperty({ type: () => Boolean, required: false })
  @IsBoolean({ message: 'car_park must be a boolean value' })
  @IsOptional()
  car_park?: boolean | null;

  @ApiProperty({ type: () => Boolean, required: false })
  @IsBoolean({ message: 'disabled_access must be a boolean value' })
  @IsOptional()
  disabled_access?: boolean | null;

  @ApiProperty({ type: () => CitySearchDTO, required: false })
  @ValidateNested()
  @IsOptional()
  @IsNotEmptyObject()
  city?: CityDTO | null;
}
