import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsString, Length, MaxLength, ValidateIf } from 'class-validator';

export default class DepartmentCreate {
  @ApiProperty({ type: String, required: false })
  @Type(() => String)
  @Transform(({ value }) => (value ? Buffer.from(value as string, 'base64url') : undefined))
  id?: Buffer;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsNotEmpty()
  @MaxLength(45)
  @ValidateIf((object, _value) => object.id === undefined)
  name?: string;

  @ApiProperty()
  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsNotEmpty()
  @Length(1, 3)
  @ValidateIf((object, _value) => object.id === undefined)
  num?: string;
}
