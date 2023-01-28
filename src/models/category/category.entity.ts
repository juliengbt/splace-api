import { ApiProperty } from '@nestjs/swagger';
import { Entity, OneToMany, PrimaryColumn } from 'typeorm';
import Sport from '../sport/sport.entity';

@Entity()
export default class Category {
  @ApiProperty({ type: String })
  @PrimaryColumn({ type: 'varchar', length: 10 })
  code: string;

  @ApiProperty({ type: String, required: true })
  name: string;

  @ApiProperty({ type: () => Sport, isArray: true })
  @OneToMany(() => Sport, (sport) => sport.category, { cascade: false })
  sports?: Sport[];
}
