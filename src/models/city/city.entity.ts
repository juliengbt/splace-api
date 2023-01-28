import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import Department from '../department/department.entity';
import Zipcode from '../zipcode/zipcode.entity';

@Entity()
export default class City {
  @ApiProperty({ type: () => String, readOnly: true })
  @PrimaryColumn({ type: 'varbinary', length: 16 })
  @Type(() => String)
  @Transform(({ value }) => (value as Buffer).toString('base64url'))
  id: Buffer;

  @ApiProperty()
  @Column({ type: 'varchar', length: 45 })
  name: string;

  @ApiProperty({ type: () => Number, isArray: true })
  @OneToMany(() => Zipcode, (zipcode) => zipcode.city, { cascade: false })
  @Transform(({ value: zips }) => zips.map((z: Zipcode) => z.code))
  zipcodes?: Zipcode[];

  @ApiProperty({ type: () => Department })
  @ManyToOne(() => Department, { cascade: false })
  @JoinColumn({ foreignKeyConstraintName: 'fk_city_department' })
  department: Department;
}
