import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsNotEmpty, IsNotEmptyObject, IsOptional, IsString, MaxLength, ValidateNested
} from 'class-validator';
import DepartmentCreate from './department.create';

export default class CityCreate {
  @ApiProperty({ type: String, required: false })
  @Type(() => String)
  @IsOptional()
  @Transform(({ value }) => Buffer.from((value as string), 'base64url'))
  id?: Buffer;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  @MaxLength(45)
  name!: string;

  @ApiProperty({ type: () => DepartmentCreate, required: true })
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => DepartmentCreate)
  department!: DepartmentCreate;
}
