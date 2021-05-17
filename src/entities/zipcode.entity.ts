import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  Column, Entity, JoinColumn, ManyToOne, PrimaryColumn
} from 'typeorm';
// eslint-disable-next-line import/no-cycle
import City from './city.entity';

@Entity('Zipcode')
export default class Zipcode {
  @ApiProperty()
  @PrimaryColumn('varbinary')
  @Transform(({ value: buf }) => buf.toString('hex'))
  id!: string;

  @ApiProperty()
  @Column({ type: 'mediumint' })
  code!: number;

  @ApiProperty({ type: () => City })
  @ManyToOne(() => City, (city) => city.id)
  @JoinColumn({ name: 'id_city' })
  city!: City;
}
