import { ApiProperty } from '@nestjs/swagger';
import {
  IsString, IsNotEmpty, Length, MaxLength
} from 'class-validator';

export default class EquipmentNatureCU {
  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  @Length(3, 10)
  code!: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  @MaxLength(45)
  label!: string;
}
