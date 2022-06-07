import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested, IsNotEmptyObject, IsArray, ArrayMinSize } from 'class-validator';
import BaseUserCreate from './baseUser.create';
import SportExists from 'src/decorators/sportExists';

export default class ProUserCreate {
  @ApiProperty({ type: BaseUserCreate, required: true, nullable: false })
  @ValidateNested()
  @IsNotEmptyObject()
  user!: BaseUserCreate;

  @ApiProperty({ type: String, isArray: true, required: true })
  @IsArray()
  @ArrayMinSize(1)
  @SportExists()
  sportsCode!: string[];
}
