import { ApiProperty } from '@nestjs/swagger';
import { MinLength, MaxLength } from 'class-validator';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('Owner')
export default class Owner {
  @ApiProperty()
  @MinLength(3, { message: 'Code must be between 3 and 10 characters' })
  @MaxLength(10, { message: 'Code must be between 3 and 10 characters' })
  @PrimaryColumn({ type: 'varchar', length: 10 })
  code!: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 45 })
  label!: string;
}
