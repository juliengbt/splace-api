import { Transform } from 'class-transformer';
import {
  Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import Department from './department.entity';
// eslint-disable-next-line import/no-cycle
import Zipcode from './zipcode.entity';

@Entity('City')
export default class City {
  @ApiProperty()
  @PrimaryColumn('varbinary')
  @Transform(({ value: buf }) => buf.toString('hex'))
  id!: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 45 })
  name!: string;

  @ApiProperty({ type: () => Number, isArray: true })
  @OneToMany(() => Zipcode, (zipcode) => zipcode.city)
  @Transform(({ value: zips }) => zips.map((z: Zipcode) => z.code))
  zipcodes?: number[];

  @ApiProperty({ type: () => Department })
  @ManyToOne(() => Department, (department) => department.id)
  @JoinColumn({ name: 'id_department' })
  department!: Department;
}
