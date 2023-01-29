/* eslint-disable max-len */
import { ApiProperty } from '@nestjs/swagger';
import { BooleanTransformer } from 'src/transformers/boolean';
import { UUIDTransformer } from 'src/transformers/uuid';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import Address from '../address/address.entity';
import Equipment from '../equipment/entities/equipment.entity';

@Entity()
export default class SportingComplex {
  @ApiProperty({ type: () => String })
  @PrimaryColumn({ type: 'varbinary', length: 16, transformer: new UUIDTransformer() })
  id: string;

  @ApiProperty()
  @Index({ fulltext: true })
  @Column({ type: 'varchar', length: 150 })
  public name: string;

  @ApiProperty({ type: Boolean, nullable: true })
  @Column({ type: 'bit', nullable: true, transformer: new BooleanTransformer() })
  public carPark: boolean | null;

  @ApiProperty({ type: Boolean, nullable: true })
  @Column({ type: 'bit', nullable: true, transformer: new BooleanTransformer() })
  public disabledAccess: boolean | null;

  @ApiProperty({ type: () => Address, required: true })
  @ManyToOne(() => Address, (address) => address.id, { cascade: ['insert'], nullable: false })
  @JoinColumn({ foreignKeyConstraintName: 'fk_sporting_complex_address' })
  public address: Address;

  @ApiProperty({ type: () => Equipment, isArray: true })
  @OneToMany(() => Equipment, (equipment) => equipment.sportingComplex, { cascade: false })
  public equipments?: Equipment[];
}
