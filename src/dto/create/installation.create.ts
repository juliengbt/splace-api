/* eslint-disable max-len */
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
  ValidateNested
} from 'class-validator';
import AddressCreate from './address.create';

export default class InstallationCreate {
  @ApiProperty({ type: String, required: false })
  @Type(() => String)
  @Transform(({ value }) => (value ? Buffer.from(value as string, 'base64url') : undefined))
  public id?: Buffer;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  @ValidateIf((object, _value) => object.id === undefined)
  public name?: string;

  @ApiProperty({ type: Boolean, required: false, nullable: true })
  @IsBoolean()
  @IsOptional()
  @ValidateIf((object, value) => value !== null && object.id === undefined)
  public car_park?: boolean | null;

  @ApiProperty({ type: Boolean, required: false, nullable: true })
  @IsBoolean()
  @IsOptional()
  @ValidateIf((object, value) => value !== null && object.id === undefined)
  public disabled_access?: boolean | null;

  @ApiProperty({ type: () => AddressCreate, required: true })
  @Type(() => AddressCreate)
  @ValidateNested()
  @IsNotEmptyObject()
  @ValidateIf((object, _value) => object.id === undefined)
  public address?: AddressCreate;
}
