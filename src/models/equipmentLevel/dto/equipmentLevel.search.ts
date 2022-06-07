import { ApiProperty } from '@nestjs/swagger';
import { Length } from 'class-validator';

export default class EquipmentLevelSearch {
  @ApiProperty({ type: String, required: false })
  @Length(3, 10, { message: 'Code must be between $constraint1 and $constraint2 characters' })
  code?: string;
}
