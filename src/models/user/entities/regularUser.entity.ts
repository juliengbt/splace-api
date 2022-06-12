import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import BaseUser from './baseUser.entity';

@Entity('RegularUser')
export default class RegularUser {
  @ApiProperty({ type: BaseUser })
  @PrimaryColumn({ type: 'varbinary', length: 16, name: 'id' })
  @OneToOne(() => BaseUser, { cascade: true, eager: true })
  @JoinColumn({ name: 'id' })
  user!: BaseUser;

  @ApiProperty({ type: String, maxLength: 100 })
  @Column({ type: 'varchar', length: 100 })
  lastname!: string;
}
