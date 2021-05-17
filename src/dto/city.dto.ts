import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize, IsArray, IsOptional, IsString, Min, MinLength
} from 'class-validator';

export default class CityDTO {
  @ApiProperty({ type: String, required: false, isArray: true })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1, { message: 'ids must contain at least $constraint1 object' })
  ids?: string[];

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString({ message: 'name must be string', each: true })
  @IsArray()
  @ArrayMinSize(1, { message: 'names must contain at least $constraint1 object' })
  @MinLength(2, { each: true, message: 'Minimum length for names is $constraint1' })
  names?: string[];

  @ApiProperty({ type: Number, required: false })
  @IsOptional()
  @Min(1000, { message: 'zip code contains at least 4 digit' })
  zipcode?: number;
}
