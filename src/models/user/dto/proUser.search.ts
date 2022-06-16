import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, NotEquals } from 'class-validator';

export default class ProUserSearch {
  @ApiProperty({ type: String, required: false, nullable: false })
  @Optional()
  @IsString()
  @NotEquals(null)
  name?: string;

  @ApiProperty({ type: String, required: false, nullable: false })
  @Optional()
  @IsString()
  @NotEquals(null)
  sport?: string;

  @ApiProperty({ type: String, required: false, nullable: false })
  @Optional()
  @IsString()
  @NotEquals(null)
  cityId?: string;
}
