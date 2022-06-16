import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsOptional, IsString, Min, MinLength } from 'class-validator';
import { randomBase64ID } from 'src/utils/functions';

export default class CitySearch {
  @ApiProperty({
    type: String,
    required: false,
    isArray: true,
    example: [randomBase64ID(), randomBase64ID()]
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  ids?: string[];

  @ApiProperty({ type: String, required: false, isArray: true })
  @IsOptional()
  @IsString({ each: true })
  @IsArray()
  @ArrayMinSize(1)
  @MinLength(1, { each: true })
  names?: string[];

  @ApiProperty({ type: Number, required: false })
  @IsOptional()
  @Min(1000, { message: 'zip code contains at least 4 digit' })
  zipcode?: number;
}
