import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { UUIDTransformer } from 'src/transformers/uuid';
import { Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
// eslint-disable-next-line import/no-cycle
import Equipment from '../equipment/entities/equipment.entity';

@Entity()
@Index(['name', 'equipment'], { unique: true })
export default class Picture {
  @ApiProperty()
  @PrimaryColumn({ type: 'varchar', length: 20 })
  name: string;

  @Exclude()
  @ManyToOne(() => Equipment, (equipment) => equipment.id, { cascade: ['insert'] })
  @JoinColumn({ foreignKeyConstraintName: 'fk_picture_equipment' })
  equipment: Equipment;

  @ApiProperty({ type: String, required: true })
  @PrimaryColumn({ type: 'varbinary', length: 16, transformer: new UUIDTransformer() })
  equipmentId: string;
}
