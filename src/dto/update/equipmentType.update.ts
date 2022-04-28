import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length, MaxLength, IsOptional } from 'class-validator';

export default class EquipmentTypeUpdate {
  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  @Length(3, 10)
  code!: string;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsNotEmpty()
  @MaxLength(45)
  @IsOptional()
  label?: string;
}
