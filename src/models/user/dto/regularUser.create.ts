import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested, IsNotEmptyObject, IsString, MaxLength } from 'class-validator';
import BaseUserCreate from './baseUser.create';

export default class RegularUserCreate {
  @ApiProperty({ type: BaseUserCreate, required: true, nullable: false })
  @ValidateNested()
  @IsNotEmptyObject()
  user!: BaseUserCreate;

  @ApiProperty({ type: String, required: true, nullable: false })
  @IsString()
  @MaxLength(100)
  lastname?: string;
}
