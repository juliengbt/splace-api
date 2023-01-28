import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
export default class EquipmentNature {
  @ApiProperty()
  @PrimaryColumn({ type: 'varchar', length: 10 })
  code: string;

  @ApiProperty()
  label: string;
}
