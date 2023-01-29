import { ApiProperty } from '@nestjs/swagger';
import { UUIDTransformer } from 'src/transformers/uuid';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export default class Department {
  @ApiProperty({ type: () => String, readOnly: true })
  @PrimaryColumn({ type: 'varbinary', length: 16, transformer: new UUIDTransformer() })
  id: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 45 })
  name: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 3 })
  num: string;
}
