import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  Column, Entity, JoinColumn, ManyToOne, PrimaryColumn
} from 'typeorm';
// eslint-disable-next-line import/no-cycle
import City from './city.entity';

@Entity('Zipcode')
export default class Zipcode {
  @ApiProperty({ type: () => String })
  @PrimaryColumn('varbinary')
  @Type(() => String)
  @Transform(({ value }) => (value as Buffer).toString('base64url'))
  readonly id!: Buffer;

  @ApiProperty()
  @Column({ type: 'mediumint' })
  code!: number;

  @ApiProperty({ type: () => City, required: true })
  @ManyToOne(() => City, (city) => city.id, { cascade: false })
  @JoinColumn({ name: 'id_city' })
  city!: City;
}
