import { Transform } from 'class-transformer';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('Department')
export default class Department {
  @ApiProperty()
  @PrimaryColumn('varbinary')

  @Transform(({ value: buf }) => buf.toString('hex'))
  id!: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 45 })
  name!: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 3 })
  num!: string;
}
