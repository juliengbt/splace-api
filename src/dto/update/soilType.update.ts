import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty, IsOptional, IsString, Length, MaxLength
} from 'class-validator';

export default class SoilType {
  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsNotEmpty()
  @Length(3, 10)
  @IsOptional()
  code?: string;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsNotEmpty()
  @MaxLength(45)
  @IsOptional()
  label?: string;
}
