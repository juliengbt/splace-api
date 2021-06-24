import {
  Column, Entity, JoinColumn, ManyToOne, PrimaryColumn
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
// eslint-disable-next-line import/no-cycle
import Category from './category.entity';

@Entity('Sport')
export default class Sport {
  @ApiProperty({ type: String })
  @PrimaryColumn({ type: 'varchar', length: 10 })
  readonly code!: string;

  @ApiProperty({ type: String })
  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @ApiProperty({ type: String })
  @Column({ type: 'varchar', length: 256, nullable: true })
  description!: string | null;

  @ApiProperty({ type: String })
  @Column({ type: 'varchar', length: 256, nullable: true })
  federation!: string | null;

  @ApiProperty({ type: () => Category })
  @JoinColumn({ name: 'code_category' })
  @ManyToOne(() => Category, (category) => category.code, { cascade: false })
  category?: Category;
}
