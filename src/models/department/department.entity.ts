import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export default class Department {
  @ApiProperty({ type: () => String, readOnly: true })
  @PrimaryColumn({ type: 'varbinary', length: 16 })
  @Type(() => String)
  @Transform(({ value }) => (value as Buffer).toString('base64url'))
  id: Buffer;

  @ApiProperty()
  @Column({ type: 'varchar', length: 45 })
  name: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 3 })
  num: string;
}
