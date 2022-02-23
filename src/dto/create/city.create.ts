import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsNotEmpty, IsNotEmptyObject, IsString, MaxLength, ValidateIf, ValidateNested
} from 'class-validator';
import DepartmentCreate from './department.create';

export default class CityCreate {
  @ApiProperty({ type: String, required: false })
  @Type(() => String)
  @Transform(({ value }) => (value ? Buffer.from((value as string), 'base64url') : undefined))
    id?: Buffer;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsNotEmpty()
  @MaxLength(45)
  @ValidateIf((object, _value) => object.id === undefined)
    name?: string;

  @ApiProperty({ type: () => DepartmentCreate, required: false })
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => DepartmentCreate)
  @ValidateIf((object, _value) => object.id === undefined)
    department?: DepartmentCreate;
}
