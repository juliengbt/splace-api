import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsInt, IsNotEmptyObject, IsOptional, Max, ValidateNested } from 'class-validator';
import CityUpdate from './city.update';

export default class ZipcodeUpdate {
  @ApiProperty({ type: String, required: true })
  @Type(() => String)
  @Transform(({ value }) => Buffer.from(value as string, 'base64url'))
  id!: Buffer;

  @ApiProperty({ type: Number, required: false })
  @IsInt()
  @Max(100000)
  @IsOptional()
  code?: number;

  @ApiProperty({ type: () => CityUpdate, required: false })
  @Type(() => CityUpdate)
  @ValidateNested()
  @IsNotEmptyObject()
  @IsOptional()
  city?: CityUpdate;
}
