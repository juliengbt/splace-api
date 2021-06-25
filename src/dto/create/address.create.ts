import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional, IsString, MaxLength, ValidateIf, ValidateNested
} from 'class-validator';
import IsCustomUUID from 'src/validators/uuid.validator';
import ZipcodeCreate from './zipcode.create';

export default class AddressCreate {
  @ApiProperty({ type: String, required: false })
  @Type(() => String)
  @IsOptional()
  @IsCustomUUID()
  @Transform(({ value }) => Buffer.from((value as string), 'base64url'))
  id?: Buffer;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  @ValidateIf((value) => value !== null)
  street_num!: string | null;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @ValidateIf((value) => value !== null)
  street_name!: string | null;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @ValidateIf((value) => value !== null)
  locality!: string | null;

  @ApiProperty({ type: Number, required: true })
  @IsInt()
  @ValidateIf((value) => value !== null)
  district!: number | null;

  @ApiProperty({ type: () => ZipcodeCreate, required: true })
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => ZipcodeCreate)
  zipcode!: ZipcodeCreate;
}
