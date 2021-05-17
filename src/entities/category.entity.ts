import {
  Column, Entity, OneToMany, PrimaryColumn
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
// eslint-disable-next-line import/no-cycle
import Sport from './sport.entity';

@Entity('Category')
export default class Category {
  @ApiProperty()
  @PrimaryColumn({ type: 'varchar', length: 10 })
  code!: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 50 })
  name!: string;

  @ApiProperty({ type: () => Sport, isArray: true })
  @OneToMany(() => Sport, (sport) => sport.category)
  sports?: Sport[];
}
