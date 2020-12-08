import { ApiProperty } from '@nestjs/swagger';
import { Length } from 'class-validator';

export default class EquipmentNatureDTO {
  @ApiProperty({ type: String, required: false })
  @Length(3, 10, { message: 'Code must be between 3 and 10 characters' })
  code?: string;
}
