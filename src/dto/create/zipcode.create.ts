import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsInt, IsNotEmptyObject, IsOptional, Max, ValidateIf, ValidateNested
} from 'class-validator';
import IsCustomUUID from 'src/validators/uuid.validator';
import CityCreate from './city.create';

export default class ZipcodeCreate {
  @ApiProperty({ type: () => String, required: false })
  @Type(() => String)
  @IsOptional()
  @IsCustomUUID()
  @Transform(({ value }) => Buffer.from((value as string), 'base64url'))
  id?: Buffer;

  @ApiProperty({ type: Number, required: true })
  @IsInt()
  @Max(100000)
  code!: number;

  @ApiProperty({ type: () => CityCreate, required: true })
  @Type(() => CityCreate)
  @ValidateNested()
  @IsNotEmptyObject()
  @ValidateIf((_object, value) => value !== null)
  city!: CityCreate;
}
