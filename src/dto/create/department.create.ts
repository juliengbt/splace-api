import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsNotEmpty, IsOptional, IsString, Length, MaxLength
} from 'class-validator';

export default class DepartmentCreate {
  @ApiProperty({ type: String, required: false })
  @Type(() => String)
  @IsOptional()
  @Transform(({ value }) => Buffer.from((value as string), 'base64url'))
  id?: Buffer;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  @MaxLength(45)
  name!: string;

  @ApiProperty()
  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  @Length(3, 3)
  num!: string;
}
