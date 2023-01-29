import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNotEmptyObject,
  IsOptional,
  MinLength,
  ValidateNested
} from 'class-validator';
import AddressSearch from '../../address/dto/address.search';

export default class SportingComplexSearch {
  @ApiProperty({ type: () => String, isArray: true, required: false })
  @IsArray({ message: 'name must in an string array' })
  @ArrayMinSize(1, { message: 'name must contain at least $constraint1 object' })
  @IsOptional()
  @MinLength(3, { each: true, message: 'Minimum length for names is $constraint1' })
  name?: string[];

  @ApiProperty({ type: () => Boolean, required: false })
  @IsBoolean({ message: 'car_park must be a boolean value' })
  @IsOptional()
  carPark?: boolean | null;

  @ApiProperty({ type: () => Boolean, required: false })
  @IsBoolean({ message: 'disabled_access must be a boolean value' })
  @IsOptional()
  disabledAccess?: boolean | null;

  @ApiProperty({ type: () => AddressSearch, required: false })
  @ValidateNested()
  @Type(() => AddressSearch)
  @IsOptional()
  @IsNotEmptyObject()
  address?: AddressSearch | null;
}
