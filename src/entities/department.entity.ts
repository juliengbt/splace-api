import { Column, Entity, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('Department')
export default class Department {
  @ApiProperty()
  @PrimaryColumn('varbinary')
  readonly id!: Buffer;

  @ApiProperty()
  @Column({ type: 'varchar', length: 45 })
  name!: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 3 })
  num!: string;
}
