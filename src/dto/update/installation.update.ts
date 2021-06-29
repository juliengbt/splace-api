/* eslint-disable max-len */
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean, IsNotEmpty, IsNotEmptyObject, IsOptional, IsString, MaxLength, ValidateIf, ValidateNested
} from 'class-validator';
import AddressUpdate from './address.update';

export default class InstallationUpdate {
  @ApiProperty({ type: String, required: true })
  @Type(() => String)
  @Transform(({ value }) => Buffer.from((value as string), 'base64url'))
  public id!: Buffer;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  @IsOptional()
  public name?: string;

  @ApiProperty({ type: Boolean, required: false, nullable: true })
  @IsBoolean()
  @IsOptional()
  @ValidateIf((_object, value) => value !== null)
  public car_park?: boolean | null;

  @ApiProperty({ type: Boolean, required: false, nullable: true })
  @IsBoolean()
  @IsOptional()
  @ValidateIf((_object, value) => value !== null)
  public disabled_access?: boolean | null;

  @ApiProperty({ type: () => AddressUpdate, required: true })
  @Type(() => AddressUpdate)
  @ValidateNested()
  @IsNotEmptyObject()
  @ValidateIf((_object, value) => value !== null)
  public address!: AddressUpdate;
}
