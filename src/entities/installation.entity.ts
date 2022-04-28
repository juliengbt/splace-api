/* eslint-disable max-len */
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn
} from 'typeorm';
import { v4 } from 'uuid';
import Address from './address.entity';
// eslint-disable-next-line import/no-cycle
import Equipment from './equipment.entity';

@Entity('Installation')
export default class Installation {
  @ApiProperty({ type: () => String })
  @PrimaryColumn({ type: 'varbinary', length: 16 })
  @Type(() => String)
  @Transform(({ value }) => (value as Buffer).toString('base64url'))
  id!: Buffer;

  @BeforeInsert()
  uuidToBin() {
    this.id = Buffer.from(v4().replace(/-/g, ''), 'hex');
  }

  @ApiProperty()
  @Column({ type: 'varchar', length: 150 })
  public name!: string;

  @ApiProperty({ type: Boolean, nullable: true })
  @Column({ type: 'bit' })
  @Transform(({ value: buf }) => (buf ? !!(buf as Buffer).readUIntBE(0, 1) : buf))
  public car_park!: boolean | null;

  @ApiProperty({ type: Boolean, nullable: true })
  @Column({ type: 'bit' })
  @Transform(({ value: buf }) => (buf ? !!(buf as Buffer).readUIntBE(0, 1) : buf))
  public disabled_access!: boolean | null;

  @ApiProperty({ type: () => Address, required: true })
  @JoinColumn({ name: 'id_address' })
  @ManyToOne(() => Address, (address) => address.id, { cascade: ['insert'], nullable: false })
  public address!: Address;

  @ApiProperty({ type: () => Equipment, isArray: true })
  @OneToMany(() => Equipment, (equipment) => equipment.installation, { cascade: false })
  @JoinColumn({ name: 'id' })
  public equipments?: Equipment[];
}
