import { Transform, Type } from 'class-transformer';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { v4 } from 'uuid';
import Department from '../department/department.entity';
// eslint-disable-next-line import/no-cycle
import Zipcode from '../zipcode/zipcode.entity';

@Entity('City')
export default class City {
  @ApiProperty({ type: () => String, readOnly: true })
  @PrimaryColumn({ type: 'varbinary', length: 16 })
  @Type(() => String)
  @Transform(({ value }) => (value as Buffer).toString('base64url'))
  id!: Buffer;

  @BeforeInsert()
  uuidToBin() {
    this.id = Buffer.from(v4().replace(/-/g, ''), 'hex');
  }

  @ApiProperty()
  @Column({ type: 'varchar', length: 45 })
  name!: string;

  @ApiProperty({ type: () => Number, isArray: true })
  @OneToMany(() => Zipcode, (zipcode) => zipcode.city, { cascade: false })
  @Transform(({ value: zips }) => zips.map((z: Zipcode) => z.code))
  zipcodes?: number[];

  @ApiProperty({ type: () => Department })
  @ManyToOne(() => Department, (department) => department.id, { cascade: false })
  @JoinColumn({ name: 'id_department' })
  department!: Department;
}
