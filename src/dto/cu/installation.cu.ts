/* eslint-disable max-len */
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean, IsNotEmpty, IsNotEmptyObject, IsOptional, IsString, MaxLength, ValidateIf, ValidateNested
} from 'class-validator';
import IsCustomUUID from 'src/validators/uuid.validators';
import AddressCU from './address.cu';

export default class InstallationCU {
  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsCustomUUID()
  public id!: Buffer;

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

  @ApiProperty({ type: () => AddressCU, required: true })
  @Type(() => AddressCU)
  @ValidateNested()
  @IsNotEmptyObject()
  @ValidateIf((_object, value) => value !== null)
  public address!: AddressCU | null;
}
