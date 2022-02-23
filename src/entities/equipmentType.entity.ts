import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('Equipment_Type')
export default class EquipmentType {
  @ApiProperty()
  @PrimaryColumn({ type: 'varchar', length: 10 })
    code!: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 60 })
    label!: string;
}
