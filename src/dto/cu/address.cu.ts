import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional, IsString, MaxLength, ValidateIf, ValidateNested
} from 'class-validator';
import IsCustomUUID from 'src/validators/uuid.validators';
import ZipcodeCU from './zipcode.cu';

export default class AddressCU {
  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsCustomUUID()
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

  @ApiProperty({ type: () => ZipcodeCU, required: true })
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => ZipcodeCU)
  zipcode!: ZipcodeCU;
}
