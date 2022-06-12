import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import City from 'src/models/city/city.entity';
import { Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryColumn } from 'typeorm';
import BaseUser from './baseUser.entity';

@Entity('ProUser')
export default class ProUser {
  @ApiProperty({ type: BaseUser })
  @Type(() => BaseUser)
  @PrimaryColumn({ type: 'varbinary', length: 16, name: 'id' })
  @OneToOne(() => BaseUser, { cascade: true })
  @JoinColumn({ name: 'id' })
  user!: BaseUser;

  @ApiProperty({ type: () => City, isArray: true })
  @ManyToMany(() => City, (c) => c.id, { cascade: true })
  @JoinTable({
    name: 'ProUser_City',
    inverseJoinColumn: { name: 'id_city' },
    joinColumn: { name: 'id_proUser' }
  })
  cities!: City[];
}
