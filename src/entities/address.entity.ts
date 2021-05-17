import {
  Column, Entity, JoinColumn, ManyToOne, PrimaryColumn
} from 'typeorm';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import Zipcode from './zipcode.entity';

@Entity('Address')
export default class Address {
  @ApiProperty()
  @PrimaryColumn('varbinary')
  @Transform(({ value: buf }) => buf.toString('hex'))
  id!: string;

  @ApiProperty()
  @Column({ nullable: true, type: 'varchar' })
  street_num!: string | null;

  @ApiProperty()
  @Column({ nullable: true, type: 'varchar' })
  street_name!: string | null;

  @ApiProperty()
  @Column({ nullable: true, type: 'varchar' })
  locality!: string | null;

  @ApiProperty()
  @Column({ nullable: true, type: 'mediumint' })
  district!: number | null;

  @ApiProperty({ type: () => Zipcode })
  @ManyToOne(() => Zipcode, (zip) => zip.id)
  @JoinColumn({ name: 'id_zipcode' })
  zipcode!: Zipcode;
}
