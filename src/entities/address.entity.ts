import { Column, Entity, PrimaryColumn } from 'typeorm';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Entity('Address')
export default class Address {
  @ApiProperty()
  @PrimaryColumn('varbinary')
  @Transform((buf: Buffer) => buf.toString('hex'))
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
}
