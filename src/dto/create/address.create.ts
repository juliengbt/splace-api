import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
  ValidateNested
} from 'class-validator';
import Default from 'src/decorators';
import ZipcodeCreate from './zipcode.create';

export default class AddressCreate {
  @ApiProperty({ type: String, required: false })
  @Type(() => String)
  @Transform(({ value }) => (value ? Buffer.from(value as string, 'base64url') : undefined))
  id?: Buffer;

  @ApiProperty({ type: String, required: false, nullable: true })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  @Default(null)
  @ValidateIf((_object, value) => value !== null)
  street_num?: string | null;

  @ApiProperty({ type: String, required: false, nullable: true })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Default(null)
  @ValidateIf((_object, value) => value !== null)
  street_name?: string | null;

  @ApiProperty({ type: String, required: false, nullable: true })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Default(null)
  @ValidateIf((_object, value) => value !== null)
  locality?: string | null;

  @ApiProperty({ type: Number, required: false, nullable: true })
  @IsInt()
  @IsOptional()
  @Default(null)
  @ValidateIf((_object, value) => value !== null)
  district?: number | null;

  @ApiProperty({ type: () => ZipcodeCreate, required: false })
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => ZipcodeCreate)
  @ValidateIf((object, _value) => object.id === undefined)
  zipcode?: ZipcodeCreate;
}
