import { Column, Entity, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

@Entity('Department')
export default class Department {
  @ApiProperty({ type: () => String, readOnly: true })
  @PrimaryColumn('varbinary')
  @Type(() => String)
  @Transform(({ value }) => (value as Buffer).toString('base64url'))
  readonly id!: Buffer;

  @ApiProperty()
  @Column({ type: 'varchar', length: 45 })
  name!: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 3 })
  num!: string;
}
