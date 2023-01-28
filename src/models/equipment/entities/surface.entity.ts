import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
export default class EquipmentSurface {
  @ApiProperty()
  @PrimaryColumn({ type: 'varchar', length: 10 })
  code: string;

  @ApiProperty()
  label: string;
}
