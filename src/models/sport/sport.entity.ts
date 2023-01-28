import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import Category from '../category/category.entity';

@Entity()
export default class Sport {
  @ApiProperty({ type: String })
  @PrimaryColumn({ type: 'varchar', length: 10 })
  readonly code: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String, nullable: true })
  @Column({ type: 'varchar', length: 256, nullable: true })
  description: string | null;

  @ApiProperty({ type: String, nullable: true })
  @Column({ type: 'varchar', length: 256, nullable: true })
  federation: string | null;

  @ApiProperty({ type: () => Category, required: false })
  @ManyToOne(() => Category, (category) => category.sports, { cascade: false, eager: true })
  @JoinColumn({ foreignKeyConstraintName: 'fk_sport_category' })
  category: Category;

  @ApiProperty({ type: String })
  @Column({ type: 'varchar', length: 100, nullable: false })
  alias: string;
}
