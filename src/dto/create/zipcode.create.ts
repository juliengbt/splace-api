import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsInt, IsNotEmptyObject, Max, ValidateIf, ValidateNested } from 'class-validator';
import CityCreate from './city.create';

export default class ZipcodeCreate {
  @ApiProperty({ type: String, required: false })
  @Type(() => String)
  @Transform(({ value }) => (value ? Buffer.from(value as string, 'base64url') : undefined))
  id?: Buffer;

  @ApiProperty({ type: Number, required: false })
  @IsInt()
  @Max(100000)
  @ValidateIf((object, _value) => object.id === undefined)
  code?: number;

  @ApiProperty({ type: () => CityCreate, required: false })
  @Type(() => CityCreate)
  @ValidateNested()
  @IsNotEmptyObject()
  @ValidateIf((object, _value) => object.id === undefined)
  city?: CityCreate;
}
