import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Transform, Type } from 'class-transformer';
import Equipment from 'src/models/equipment/entities/equipment.entity';
import Sport from 'src/models/sport/sport.entity';
import { UUIDTransformer } from 'src/transformers/uuid';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryColumn
} from 'typeorm';
import Token from '../../token/token.entity';

@Entity()
export default class User {
  @ApiProperty({ type: String, readOnly: true })
  @Type(() => String)
  @PrimaryColumn({ type: 'varbinary', length: 16, transformer: new UUIDTransformer() })
  id: string;

  @ApiProperty({ type: String, required: true })
  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Exclude()
  @Column({ type: 'varchar', length: 255 })
  password: string;

  @ApiProperty({ type: String, required: true })
  @Column({ type: 'varchar', length: 100 })
  firstname: string;

  @ApiProperty({ type: String, maxLength: 100 })
  @Column({ type: 'varchar', length: 100 })
  lastname: string;

  @ApiProperty({ type: Date, required: true })
  @CreateDateColumn()
  creationAt: Date;

  @ApiProperty({ type: Boolean, nullable: false, default: false })
  @Column({ type: 'bit' })
  @Transform(({ value: buf }) => (buf ? !!(buf as Buffer).readUIntBE(0, 1) : buf))
  isEmailConfirmed: boolean;

  @ApiProperty({ type: () => Sport, isArray: true })
  @ManyToMany(() => Sport, (s) => s.code, { cascade: true })
  @JoinTable({
    name: 'user_sport',
    inverseJoinColumn: { name: 'sportCode', foreignKeyConstraintName: 'fr_user_sport_sport' },
    joinColumn: { name: 'userId', foreignKeyConstraintName: 'fr_user_sport_user' }
  })
  sports: Sport[];

  @ApiProperty({ type: () => Equipment, isArray: true })
  @ManyToMany(() => Equipment, (e) => e.savedByUsers, { cascade: false, eager: false })
  @JoinTable({
    name: 'user_equipment',
    inverseJoinColumn: {
      name: 'equipmentId',
      foreignKeyConstraintName: 'fr_user_svaed_equipment_equipment'
    },
    joinColumn: { name: 'userId', foreignKeyConstraintName: 'fr_user_svaed_equipment_user' }
  })
  savedEquipments: Equipment[];

  @Exclude()
  @OneToOne(() => Token, (token) => token.user, { cascade: false, lazy: false, eager: true })
  token: Token;

  @Exclude()
  @DeleteDateColumn()
  deletedAt: Date;
}
