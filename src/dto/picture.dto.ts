import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, ValidateNested } from 'class-validator';
// eslint-disable-next-line import/no-cycle
import EquipmentDTO from './equipment.dto';

export default class PictureDTO {
  @ApiProperty({ type: () => String, required: false })
  name?: string;

  @ApiProperty({ type: () => EquipmentDTO, required: false })
  @ValidateNested()
  @IsOptional()
  equipment!: EquipmentDTO;
}
