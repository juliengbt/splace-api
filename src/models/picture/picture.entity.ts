import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Transform, Type } from 'class-transformer';
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
  @Type(() => String)
  @Transform(({ value }) => (value as Buffer).toString('base64url'))
  @PrimaryColumn({ type: 'varbinary', length: 16 })
  equipmentId: Buffer;
}
