import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import BaseUser from '../user/entities/baseUser.entity';

@Entity('Token')
export default class Token {
  @ApiProperty({ type: () => BaseUser, required: true })
  @ManyToOne(() => BaseUser, (user) => user.id, { cascade: true })
  @JoinColumn({ name: 'id_user' })
  @PrimaryColumn({ name: 'id_user', type: 'varbinary' })
  user!: BaseUser;

  @ApiProperty({ type: Date, required: true })
  @Column({ type: 'datetime' })
  last_connection!: Date;

  @ApiProperty({ type: Date, required: true })
  @Column({ type: 'datetime' })
  exp!: Date;

  @Exclude()
  @PrimaryColumn({ type: 'varchar', length: 255, nullable: false })
  refresh_token_hash!: string;
}
