import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize, IsArray, IsOptional, IsString, Min, MinLength
} from 'class-validator';

export default class CityDTO {
  @ApiProperty({ type: String, required: false })
  @IsOptional()
  id?: string;

  @ApiProperty({ type: String, required: false, isArray: true })
  @IsArray()
  @IsOptional()
  @ArrayMinSize(1, { message: 'name must contain at least $value object' })
  @IsString({ each: true, message: 'name must contains strings' })
  @MinLength(3, { each: true, message: 'Minimum length for names is $value' })
  name?: string[];

  @ApiProperty({ type: Number, required: false })
  @IsOptional()
  @Min(1000, { message: 'zip code contains at least 4 digit' })
  zip_code?: number;
}
