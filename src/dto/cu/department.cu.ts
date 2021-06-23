import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty, IsOptional, IsString, Length, MaxLength
} from 'class-validator';
import IsCustomUUID from 'src/validators/uuid.validators';

export default class DepartmentCU {
  @ApiProperty({ type: String, required: false })
  @IsCustomUUID()
  @IsOptional()
  id?: Buffer;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  @MaxLength(45)
  name!: string;

  @ApiProperty()
  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  @Length(3, 3)
  num!: string;
}
