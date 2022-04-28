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
import Default from 'src/decorators';
import CategoryCreate from './category.create';

export default class SportCreate {
  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  @Length(3, 10)
  code!: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  @IsOptional()
  @Default(null)
  @ValidateIf((_object, value) => value !== null)
  description?: string | null;

  @ApiProperty({ type: String, required: false, nullable: true })
  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  @IsOptional()
  @Default(null)
  @ValidateIf((_object, value) => value !== null)
  federation?: string | null;

  @ApiProperty({ type: () => CategoryCreate, required: true })
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CategoryCreate)
  category!: CategoryCreate;
}
