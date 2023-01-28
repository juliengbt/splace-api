/* eslint-disable max-len */
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import Address from '../address/address.entity';
import Equipment from '../equipment/entities/equipment.entity';

@Entity()
export default class SportingComplex {
  @ApiProperty({ type: () => String })
  @PrimaryColumn({ type: 'varbinary', length: 16 })
  @Type(() => String)
  @Transform(({ value }) => (value as Buffer).toString('base64url'))
  id: Buffer;

  @ApiProperty()
  @Index({ fulltext: true, parser: 'ngram' })
  @Column({ type: 'varchar', length: 150 })
  public name: string;

  @ApiProperty({ type: Boolean, nullable: true })
  @Column({ type: 'bit', nullable: true })
  @Transform(({ value: buf }) => (buf ? !!(buf as Buffer).readUIntBE(0, 1) : buf))
  public carPark: boolean | null;

  @ApiProperty({ type: Boolean, nullable: true })
  @Column({ type: 'bit', nullable: true })
  @Transform(({ value: buf }) => (buf ? !!(buf as Buffer).readUIntBE(0, 1) : buf))
  public disabledAccess: boolean | null;

  @ApiProperty({ type: () => Address, required: true })
  @ManyToOne(() => Address, (address) => address.id, { cascade: ['insert'], nullable: false })
  @JoinColumn({ foreignKeyConstraintName: 'fk_sporting_complex_address' })
  public address: Address;

  @ApiProperty({ type: () => Equipment, isArray: true })
  @OneToMany(() => Equipment, (equipment) => equipment.sportingComplex, { cascade: false })
  public equipments?: Equipment[];
}
