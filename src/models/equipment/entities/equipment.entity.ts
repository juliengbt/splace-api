import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Transform, Type } from 'class-transformer';
import User from 'src/models/user/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn
} from 'typeorm';
import Picture from '../../picture/picture.entity';
import Sport from '../../sport/sport.entity';
import SportingComplex from '../../sporting-complex/sporting-complex.entity';
import EquipmentLevel from './level.entity';
import EquipmentNature from './nature.entity';
import EquipmentOwner from './owner.entity';
import EquipmentSurface from './surface.entity';
import EquipmentType from './type.entity';

@Entity()
export default class Equipment {
  @ApiProperty({ type: String, readOnly: true })
  @Type(() => String)
  @Transform(({ value }) => (value as Buffer).toString('base64url'))
  @PrimaryColumn({ type: 'varbinary', length: 16 })
  id: Buffer;

  @ApiProperty()
  @Index({ fulltext: true, parser: 'ngram' })
  @Column({ type: 'varchar', length: 150 })
  name: string;

  @ApiProperty({ type: String, nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  otherInfo: string | null;

  @ApiProperty({ type: Boolean, nullable: true })
  @Column({ type: 'bit', nullable: true })
  @Transform(({ value: buf }) => (buf ? !!(buf as Buffer).readUIntBE(0, 1) : buf))
  openAccess: boolean | null;

  @ApiProperty({ type: Boolean, nullable: true })
  @Column({ type: 'bit', nullable: true })
  @Transform(({ value: buf }) => (buf ? !!(buf as Buffer).readUIntBE(0, 1) : buf))
  locker: boolean | null;

  @ApiProperty({ type: Boolean, nullable: true })
  @Column({ type: 'bit', nullable: true })
  @Transform(({ value: buf }) => (buf ? !!(buf as Buffer).readUIntBE(0, 1) : buf))
  lighting: boolean | null;

  @ApiProperty({ type: Boolean, nullable: true })
  @Column({ type: 'bit', nullable: true })
  @Transform(({ value: buf }) => (buf ? !!(buf as Buffer).readUIntBE(0, 1) : buf))
  shower: boolean | null;

  @ApiProperty({ type: Number })
  @Column({ type: 'smallint', default: 1 })
  amount: number;

  @ApiProperty({ type: Number })
  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  @Type(() => Number)
  @Transform(({ value: val }) => Number(val))
  longitude: number | null;

  @ApiProperty({ type: Number })
  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  @Type(() => Number)
  @Transform(({ value: val }) => Number(val))
  latitude: number | null;

  @ApiProperty({ type: () => SportingComplex, nullable: true, required: true })
  @ManyToOne(() => SportingComplex, (sportingComplex) => sportingComplex.equipments, {
    cascade: ['insert'],
    nullable: true
  })
  @JoinColumn({ foreignKeyConstraintName: 'fk_equipment_sporting_complex' })
  sportingComplex: SportingComplex | null;

  @ApiProperty({ type: () => EquipmentOwner })
  @ManyToOne(() => EquipmentOwner, { cascade: false, nullable: true, eager: true })
  @JoinColumn({ foreignKeyConstraintName: 'fk_equipment_owner' })
  owner: EquipmentOwner | null;

  @ApiProperty({ type: () => EquipmentSurface, nullable: true })
  @ManyToOne(() => EquipmentSurface, { cascade: false, nullable: true, eager: true })
  @JoinColumn({ foreignKeyConstraintName: 'fk_equipment_surface' })
  surface: EquipmentSurface | null;

  @ApiProperty({ type: () => EquipmentNature, nullable: true })
  @ManyToOne(() => EquipmentNature, { cascade: false, nullable: true, eager: true })
  @JoinColumn({ foreignKeyConstraintName: 'fk_equipment_nature' })
  nature: EquipmentNature | null;

  @ApiProperty({ type: () => EquipmentType, nullable: false })
  @ManyToOne(() => EquipmentType, { cascade: false, nullable: true, eager: true })
  @JoinColumn({ foreignKeyConstraintName: 'fk_equipment_type' })
  type: EquipmentType;

  @ApiProperty({ type: () => EquipmentLevel, nullable: true })
  @ManyToOne(() => EquipmentLevel, { cascade: false, nullable: true, eager: true })
  @JoinColumn({ foreignKeyConstraintName: 'fk_equipment_level' })
  level: EquipmentLevel | null;

  @ApiProperty({ type: () => Sport, isArray: true })
  @ManyToMany(() => Sport, { cascade: false, eager: false })
  @JoinTable({
    name: 'equipment_sport',
    inverseJoinColumn: { name: 'sportCode', foreignKeyConstraintName: 'fk_equipment_sport_sport' },
    joinColumn: { name: 'equipmentId', foreignKeyConstraintName: 'fk_equipment_sport_equipment' }
  })
  sports: Sport[];

  @ApiProperty({ type: () => Picture, isArray: true })
  @OneToMany(() => Picture, (pictures) => pictures.equipment, { cascade: ['insert'] })
  pictures: Picture[];

  @Exclude()
  @ManyToMany(() => User, (o) => o.savedEquipments, { cascade: false, eager: false })
  savedByUsers: User[];
}
