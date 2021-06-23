import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty, IsString, Length, MaxLength
} from 'class-validator';

export default class CategoryCU {
  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  @Length(3, 10)
  code!: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name!: string;
}
