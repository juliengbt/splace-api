import {
  Column, Entity, JoinColumn, ManyToOne, PrimaryColumn
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import Zipcode from './zipcode.entity';

@Entity('Address')
export default class Address {
  @ApiProperty()
  @PrimaryColumn('varbinary')
  readonly id!: Buffer;

  @ApiProperty()
  @Column({ nullable: true, type: 'varchar', length: 10 })
  street_num!: string | null;

  @ApiProperty()
  @Column({ nullable: true, type: 'varchar', length: 100 })
  street_name!: string | null;

  @ApiProperty()
  @Column({ nullable: true, type: 'varchar', length: 100 })
  locality!: string | null;

  @ApiProperty()
  @Column({ nullable: true, type: 'mediumint' })
  district!: number | null;

  @ApiProperty({ type: () => Zipcode })
  @ManyToOne(() => Zipcode, (zip) => zip.id, { cascade: false })
  @JoinColumn({ name: 'id_zipcode' })
  zipcode!: Zipcode;
}
