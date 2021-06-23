import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty, IsString, Length, MaxLength
} from 'class-validator';

export default class OwnerCU {
  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  @Length(3, 10, { message: 'Code must be between 3 and 10 characters' })
  code!: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  label!: string;
}
