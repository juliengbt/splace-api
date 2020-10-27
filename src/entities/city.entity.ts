import { Transform } from 'class-transformer';
import {
  Column, Entity, JoinColumn, ManyToOne, PrimaryColumn
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import Department from './department.entity';

@Entity('City')
export default class City {
  @ApiProperty()
  @PrimaryColumn('varbinary')
  @Transform((buf: Buffer) => buf.toString('hex'))
  id!: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 45 })
  name!: string;

  @ApiProperty()
  @Column({ type: 'mediumint' })
  zip_code!: number;

  @ApiProperty({ type: () => Department })
  @ManyToOne(() => Department, (department) => department.id)
  @JoinColumn({ name: 'id_department' })
  department!: Department;
}
