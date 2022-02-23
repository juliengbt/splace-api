import {
  BeforeInsert, Column, Entity, PrimaryColumn
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { v4 } from 'uuid';

@Entity('Department')
export default class Department {
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

  @ApiProperty()
  @Column({ type: 'varchar', length: 3 })
    num!: string;
}
