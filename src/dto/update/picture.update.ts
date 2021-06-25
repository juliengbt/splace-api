import { ApiProperty } from '@nestjs/swagger';
import {
  IsString, IsNotEmpty, MaxLength, IsOptional
} from 'class-validator';

export default class PictureUpdate {
  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsNotEmpty()
  @MaxLength(45)
  @IsOptional()
  name?: string;
}
