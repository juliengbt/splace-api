import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  ValidateIf,
  ValidateNested
} from 'class-validator';
import CategoryUpdate from './category.update';

export default class SportUpdate {
  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  @Length(3, 10)
  code!: string;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @IsOptional()
  name?: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  @IsOptional()
  @ValidateIf((_object, value) => value !== null)
  description?: string | null;

  @ApiProperty({ type: String, required: false, nullable: true })
  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  @IsOptional()
  @ValidateIf((_object, value) => value !== null)
  federation?: string | null;

  @ApiProperty({ type: () => CategoryUpdate, required: false })
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CategoryUpdate)
  @IsOptional()
  category?: CategoryUpdate;
}
