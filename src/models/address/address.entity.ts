import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import Zipcode from '../zipcode/zipcode.entity';

@Entity()
export default class Address {
  @ApiProperty({ type: () => String, readOnly: true })
  @PrimaryColumn({ type: 'varbinary', length: 16 })
  @Type(() => String)
  @Transform(({ value }) => (value as Buffer).toString('base64url'))
  id: Buffer;

  @ApiProperty({ type: String, nullable: true })
  @Column({ nullable: true, type: 'varchar', length: 10 })
  streetNum: string | null;

  @ApiProperty({ type: String, nullable: true })
  @Column({ nullable: true, type: 'varchar', length: 100 })
  streetName: string | null;

  @ApiProperty({ type: String, nullable: true })
  @Column({ nullable: true, type: 'varchar', length: 100 })
  locality: string | null;

  @ApiProperty({ type: Number, nullable: true })
  @Column({ nullable: true, type: 'mediumint' })
  district: number | null;

  @ApiProperty({ type: () => Zipcode, required: true })
  @ManyToOne(() => Zipcode, (zip) => zip.id, { cascade: false })
  @JoinColumn({ foreignKeyConstraintName: 'fk_city_zipcode' })
  zipcode: Zipcode;
}
