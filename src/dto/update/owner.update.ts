import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty, IsOptional, IsString, Length, MaxLength
} from 'class-validator';

export default class OwnerUpdate {
  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsNotEmpty()
  @Length(3, 10, { message: 'Code must be between 3 and 10 characters' })
  @IsOptional()
  code?: string;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @IsOptional()
  label?: string;
}
