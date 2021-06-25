import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsInt, IsNotEmptyObject, IsOptional, Max, ValidateIf, ValidateNested
} from 'class-validator';
import CityUpdate from './city.update';

export default class ZipcodeUpdate {
  @ApiProperty({ type: String, required: false })
  @Type(() => String)
  @IsOptional()
  @Transform(({ value }) => Buffer.from((value as string), 'base64url'))
  id?: Buffer;

  @ApiProperty({ type: Number, required: false })
  @IsInt()
  @Max(100000)
  @IsOptional()
  code?: number;

  @ApiProperty({ type: () => CityUpdate, required: false })
  @Type(() => CityUpdate)
  @ValidateNested()
  @IsNotEmptyObject()
  @ValidateIf((_object, value) => value !== null)
  @IsOptional()
  city?: CityUpdate;
}
