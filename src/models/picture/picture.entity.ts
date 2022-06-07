import { ApiProperty } from '@nestjs/swagger';
import { Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
// eslint-disable-next-line import/no-cycle
import Equipment from '../equipment/equipment.entity';

@Entity('Picture')
@Index(['name', 'equipment'], { unique: true })
export default class Picture {
  @ApiProperty()
  @PrimaryColumn({ type: 'varchar', length: 20 })
  name!: string;

  @ApiProperty({ type: () => Equipment })
  @PrimaryColumn({ type: 'varbinary', name: 'id_equipment' })
  @ManyToOne(() => Equipment, (equipment) => equipment.id, { cascade: ['insert'] })
  @JoinColumn({ name: 'id_equipment' })
  equipment!: Equipment;
}
