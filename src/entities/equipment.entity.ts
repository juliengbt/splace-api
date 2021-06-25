import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn
} from 'typeorm';
import EquipmentLevel from './equipmentLevel.entity';
import EquipmentNature from './equipmentNature.entity';
import EquipmentType from './equipmentType.entity';
// eslint-disable-next-line import/no-cycle
import Installation from './installation.entity';
import Owner from './owner.entity';
// eslint-disable-next-line import/no-cycle
import Picture from './picture.entity';
import SoilType from './soilType.entity';
import Sport from './sport.entity';

@Entity('Equipment')
export default class Equipment {
  @ApiProperty({ type: String, readOnly: true })
  @Type(() => String)
  @Transform(({ value }) => (value as Buffer).toString('base64url'))
  @PrimaryColumn('varbinary')
  readonly id!: Buffer;

  @ApiProperty()
  @Column({ type: 'varchar', length: 150 })
  name!: string;

  @ApiProperty({ type: String })
  @Column({ type: 'varchar', length: 256 })
  other_info!: string | null;

  @ApiProperty({ type: Boolean })
  @Column({ type: 'bit' })
  @Transform(({ value: buf }) => (buf ? buf.readUIntBE(0, 1) : buf))
  open_access!: boolean | null;

  @ApiProperty({ type: Boolean })
  @Column({ type: 'bit' })
  @Transform(({ value: buf }) => (buf ? buf.readUIntBE(0, 1) : buf))
  locker!: boolean | null;

  @ApiProperty({ type: Boolean })
  @Column({ type: 'bit' })
  @Transform(({ value: buf }) => (buf ? buf.readUIntBE(0, 1) : buf))
  lighting!: boolean | null;

  @ApiProperty({ type: Boolean })
  @Column({ type: 'bit' })
  @Transform(({ value: buf }) => (buf ? buf.readUIntBE(0, 1) : buf))
  shower!: boolean | null;

  @ApiProperty({ type: Number })
  @Column({ type: 'smallint' })
  amount!: number;

  @ApiProperty({ type: Number })
  @Column({ type: 'decimal', precision: 10, scale: 7 })
  @Type(() => Number)
  @Transform(({ value: val }) => Number(val))
  longitude!: number | null;

  @ApiProperty({ type: Number })
  @Column({ type: 'decimal', precision: 10, scale: 7 })
  @Type(() => Number)
  @Transform(({ value: val }) => Number(val))
  latitude!: number | null;

  @ApiProperty({ type: () => Installation })
  @ManyToOne(() => Installation, (installation) => installation.id, { cascade: ['insert'] })
  @JoinColumn({ name: 'id_installation' })
  installation?: Installation | null;

  @ApiProperty({ type: () => Owner })
  @ManyToOne(() => Owner, (owner) => owner.code, { cascade: false })
  @JoinColumn({ name: 'code_owner' })
  owner?: Owner | null;

  @ApiProperty({ type: () => SoilType })
  @ManyToOne(() => SoilType, (s_t) => s_t.code, { cascade: false })
  @JoinColumn({ name: 'code_soil_type' })
  soil_type?: SoilType | null;

  @ApiProperty({ type: () => EquipmentNature })
  @ManyToOne(() => EquipmentNature, (e_n) => e_n.code, { cascade: false })
  @JoinColumn({ name: 'code_equipment_nature' })
  equipment_nature?: EquipmentNature | null;

  @ApiProperty({ type: () => EquipmentType })
  @ManyToOne(() => EquipmentType, (e_t) => e_t.code, { cascade: false })
  @JoinColumn({ name: 'code_equipment_type' })
  equipment_type?: EquipmentType | null;

  @ApiProperty({ type: () => EquipmentLevel })
  @ManyToOne(() => EquipmentLevel, (e_l) => e_l.code, { cascade: false })
  @JoinColumn({ name: 'code_equipment_level' })
  equipment_level?: EquipmentLevel | null;

  @ApiProperty({ type: () => Sport })
  @ManyToMany(() => Sport, (sport) => sport.code, { cascade: false })
  @JoinTable({ name: 'Equipment_Sport', inverseJoinColumn: { name: 'code_sport' }, joinColumn: { name: 'id_equipment' } })
  sports!: Sport[];

  @ApiProperty({ type: () => Picture, isArray: true })
  @OneToMany(() => Picture, (pictures) => pictures.equipment, { cascade: ['insert'] })
  @JoinColumn({ name: 'id' })
  pictures!: Picture[];

  @ApiProperty({ type: Number })
  rating!: number | null;
}
