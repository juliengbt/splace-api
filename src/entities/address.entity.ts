import {
  BeforeInsert,
  Column, Entity, JoinColumn, ManyToOne, PrimaryColumn
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { v4 } from 'uuid';
import Zipcode from './zipcode.entity';

@Entity('Address')
export default class Address {
  @ApiProperty({ type: () => String, readOnly: true })
  @PrimaryColumn({ type: 'varbinary', length: 16 })
  @Type(() => String)
  @Transform(({ value }) => (value as Buffer).toString('base64url'))
    id!: Buffer;

  @BeforeInsert()
  uuidToBin() {
    this.id = Buffer.from(v4().replace(/-/g, ''), 'hex');
  }

  @ApiProperty({ type: String, nullable: true })
  @Column({ nullable: true, type: 'varchar', length: 10 })
    street_num!: string | null;

  @ApiProperty({ type: String, nullable: true })
  @Column({ nullable: true, type: 'varchar', length: 100 })
    street_name!: string | null;

  @ApiProperty({ type: String, nullable: true })
  @Column({ nullable: true, type: 'varchar', length: 100 })
    locality!: string | null;

  @ApiProperty({ type: Number, nullable: true })
  @Column({ nullable: true, type: 'mediumint' })
    district!: number | null;

  @ApiProperty({ type: () => Zipcode, required: true })
  @ManyToOne(() => Zipcode, (zip) => zip.id, { cascade: false })
  @JoinColumn({ name: 'id_zipcode' })
    zipcode!: Zipcode;
}
