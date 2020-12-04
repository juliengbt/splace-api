import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
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
  @ApiProperty()
  @PrimaryColumn('varbinary')
  @Transform((buf: Buffer) => buf.toString('hex'))
  id!: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 150 })
  name!: string;

  @ApiProperty({ type: String })
  @Column({ type: 'varchar', length: 256 })
  other_info!: string | null;

  @ApiProperty({ type: Boolean })
  @Column({ type: 'bit' })
  @Transform((buf: Buffer) => (buf ? buf.readUIntBE(0, 1) : buf))
  open_access!: boolean | null;

  @ApiProperty({ type: Boolean })
  @Column({ type: 'bit' })
  @Transform((buf: Buffer) => (buf ? buf.readUIntBE(0, 1) : buf))
  locker!: boolean | null;

  @ApiProperty({ type: Boolean })
  @Column({ type: 'bit' })
  @Transform((buf: Buffer) => (buf ? buf.readUIntBE(0, 1) : buf))
  lighting!: boolean | null;

  @ApiProperty({ type: Boolean })
  @Column({ type: 'bit' })
  @Transform((buf: Buffer) => (buf ? buf.readUIntBE(0, 1) : buf))
  shower!: boolean | null;

  @ApiProperty({ type: Number })
  @Column({ type: 'smallint' })
  amount!: number;

  @ApiProperty({ type: Number })
  @Column({ type: 'decimal', precision: 10, scale: 7 })
  longitude!: number | null;

  @ApiProperty({ type: Number })
  @Column({ type: 'decimal', precision: 10, scale: 7 })
  latitude!: number | null;

  @ApiProperty({ type: () => Installation })
  @ManyToOne(() => Installation, (installation) => installation.id)
  @JoinColumn({ name: 'id_installation' })
  installation?: Installation | null;

  @ApiProperty({ type: () => Owner })
  @ManyToOne(() => Owner, (owner) => owner.code)
  @JoinColumn({ name: 'code_owner' })
  owner?: Owner | null;

  @ApiProperty({ type: () => SoilType })
  @ManyToOne(() => SoilType, (s_t) => s_t.code)
  @JoinColumn({ name: 'code_soil_type' })
  soil_type?: SoilType | null;

  @ApiProperty({ type: () => EquipmentNature })
  @ManyToOne(() => EquipmentNature, (e_n) => e_n.code)
  @JoinColumn({ name: 'code_equipment_nature' })
  equipment_nature?: EquipmentNature | null;

  @ApiProperty({ type: () => EquipmentType })
  @ManyToOne(() => EquipmentType, (e_t) => e_t.code)
  @JoinColumn({ name: 'code_equipment_type' })
  equipment_type?: EquipmentType | null;

  @ApiProperty({ type: () => EquipmentLevel })
  @ManyToOne(() => EquipmentLevel, (e_l) => e_l.code)
  @JoinColumn({ name: 'code_equipment_level' })
  equipment_level?: EquipmentLevel | null;

  @ApiProperty({ type: () => Sport })
  @ManyToMany(() => Sport, (sport) => sport.code)
  @JoinTable({ name: 'Equipment_Sport', inverseJoinColumn: { name: 'code_sport' }, joinColumn: { name: 'id_equipment' } })
  sports!: Sport[];

  @ApiProperty({ type: () => Picture })
  @OneToMany(() => Picture, (picture) => picture.equipment)
  @JoinColumn({ name: 'id' })
  pictures!: Picture[];

  @ApiProperty({ type: Number })
  rating!: number | null;

  @ApiProperty()
  @Column('double', { select: false })
  distance!: number;
}
