import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, Length, MaxLength } from 'class-validator';

export default class DepartmentUpdate {
  @ApiProperty({ type: String, required: true })
  @Type(() => String)
  @Transform(({ value }) => Buffer.from(value as string, 'base64url'))
  id!: Buffer;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsNotEmpty()
  @MaxLength(45)
  @IsOptional()
  name?: string;

  @ApiProperty()
  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsNotEmpty()
  @Length(1, 3)
  @IsOptional()
  num?: string;
}
