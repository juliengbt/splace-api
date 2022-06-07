import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import BaseUser, { Role } from './baseUser.entity';

@Entity('ProUser')
export default class ProUser {
  @ApiProperty({ type: BaseUser })
  @Type(() => BaseUser)
  @PrimaryColumn({ type: 'varbinary', length: 16, name: 'id' })
  @OneToOne(() => BaseUser, { cascade: true })
  @JoinColumn({ name: 'id' })
  user!: BaseUser;

  @ApiProperty({ type: Role, enum: Role })
  role!: Role.PRO;
}
