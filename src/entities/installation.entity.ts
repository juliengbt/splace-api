/* eslint-disable max-len */
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn
} from 'typeorm';
import Address from './address.entity';
// eslint-disable-next-line import/no-cycle
import Equipment from './equipment.entity';

@Entity('Installation')
export default class Installation {
  @ApiProperty()
  @PrimaryColumn('varbinary')
  readonly id!: Buffer;

  @ApiProperty()
  @Column({ type: 'varchar', length: 150 })
  public name!: string;

  @ApiProperty({ type: Boolean })
  @Column({ type: 'bit' })

  @Transform(({ value: buf }) => (buf ? buf.readUIntBE(0, 1) : buf))
  public car_park!: boolean | null;

  @ApiProperty({ type: Boolean })
  @Column({ type: 'bit' })

  @Transform(({ value: buf }) => (buf ? buf.readUIntBE(0, 1) : buf))
  public disabled_access!: boolean | null;

  @ApiProperty({ type: () => Address })
  @JoinColumn({ name: 'id_address' })
  @ManyToOne(() => Address, (address) => address.id, { cascade: ['insert'] })
  public address?: Address | null;

  @ApiProperty({ type: () => Equipment, isArray: true })
  @OneToMany(() => Equipment, (equipment) => equipment.installation, { cascade: ['insert'] })
  @JoinColumn({ name: 'id' })
  public equipments?: Equipment[];
}
