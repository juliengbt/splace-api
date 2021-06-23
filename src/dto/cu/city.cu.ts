import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty, IsNotEmptyObject, IsOptional, IsString, MaxLength, ValidateNested
} from 'class-validator';
import IsCustomUUID from 'src/validators/uuid.validators';
import DepartmentCU from './department.cu';

export default class CityCU {
  @ApiProperty({ type: String, required: false })
  @IsCustomUUID()
  @IsOptional()
  id?: Buffer;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  @MaxLength(45)
  name!: string;

  @ApiProperty({ type: () => DepartmentCU, required: true })
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => DepartmentCU)
  department!: DepartmentCU;
}
