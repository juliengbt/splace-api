/* eslint-disable max-len */
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean, IsNotEmpty, IsNotEmptyObject, IsOptional, IsString, MaxLength, ValidateIf, ValidateNested
} from 'class-validator';
import AddressCreate from './address.create';

export default class InstallationCreate {
  @ApiProperty({ type: String, required: false })
  @Type(() => String)
  @IsOptional()
  @Transform(({ value }) => Buffer.from((value as string), 'base64url'))
  id?: Buffer;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  public name!: string;

  @ApiProperty({ type: Boolean, required: true })
  @IsBoolean()
  @ValidateIf((_object, value) => value !== null)
  public car_park!: boolean | null;

  @ApiProperty({ type: Boolean, required: true })
  @IsBoolean()
  @ValidateIf((_object, value) => value !== null)
  public disabled_access!: boolean | null;

  @ApiProperty({ type: () => AddressCreate, required: true })
  @Type(() => AddressCreate)
  @ValidateNested()
  @IsNotEmptyObject()
  @ValidateIf((_object, value) => value !== null)
  public address!: AddressCreate | null;
}
