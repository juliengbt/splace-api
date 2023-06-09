import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export default class EquipmentType {
  @ApiProperty({ type: () => String })
  @PrimaryColumn({ type: 'varchar', length: 10 })
  code: string;

  @ApiProperty({ type: String })
  label: string;

  @ApiProperty({ type: String })
  @Column({ type: 'varchar', length: 10 })
  icon: string;

  @ApiProperty({ type: String })
  @Column({ type: 'varchar', length: 100, nullable: false })
  alias: string;
}
