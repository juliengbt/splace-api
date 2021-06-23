import { ApiProperty } from '@nestjs/swagger';
import {
  Column, Entity, JoinColumn, ManyToOne, PrimaryColumn
} from 'typeorm';
// eslint-disable-next-line import/no-cycle
import City from './city.entity';

@Entity('Zipcode')
export default class Zipcode {
  @ApiProperty()
  @PrimaryColumn('varbinary')
  id!: Buffer;

  @ApiProperty()
  @Column({ type: 'mediumint' })
  code!: number;

  @ApiProperty({ type: () => City })
  @ManyToOne(() => City, (city) => city.id, { cascade: ['insert'] })
  @JoinColumn({ name: 'id_city' })
  city!: City;
}
