import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional, IsString, MaxLength, ValidateIf, ValidateNested
} from 'class-validator';
import ZipcodeUpdate from './zipcode.update';

export default class AddressUpdate {
  @ApiProperty({ type: String, required: true })
  @Type(() => String)
  @Transform(({ value }) => Buffer.from((value as string), 'base64url'))
  id!: Buffer;

  @ApiProperty({ type: String, required: false, nullable: true })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  @IsOptional()
  @ValidateIf((value) => value !== null)
  street_num?: string | null;

  @ApiProperty({ type: String, required: false, nullable: true })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @IsOptional()
  @ValidateIf((value) => value !== null)
  street_name?: string | null;

  @ApiProperty({ type: String, required: false, nullable: true })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @IsOptional()
  @ValidateIf((value) => value !== null)
  locality?: string | null;

  @ApiProperty({ type: Number, required: false, nullable: true })
  @IsInt()
  @IsOptional()
  @ValidateIf((value) => value !== null)
  district?: number | null;

  @ApiProperty({ type: () => ZipcodeUpdate, required: false })
  @IsNotEmptyObject()
  @ValidateNested()
  @IsOptional()
  @Type(() => ZipcodeUpdate)
  zipcode?: ZipcodeUpdate;
}
