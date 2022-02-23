import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty, IsOptional, IsString, Length, MaxLength
} from 'class-validator';

export default class CategoryUpdate {
  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  @Length(3, 10)
    code!: string;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @IsOptional()
    name?: string;
}
