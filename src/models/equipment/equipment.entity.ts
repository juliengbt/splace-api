import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn
} from 'typeorm';
import { v4 } from 'uuid';
import EquipmentLevel from '../equipmentLevel/equipmentLevel.entity';
import EquipmentNature from '../equipmentNature/equipmentNature.entity';
import EquipmentType from '../equipmentType/equipmentType.entity';
// eslint-disable-next-line import/no-cycle
import Installation from '../installation/installation.entity';
import Owner from '../owner/owner.entity';
// eslint-disable-next-line import/no-cycle
import Picture from '../picture/picture.entity';
import SoilType from '../soilType/soilType.entity';
import Sport from '../sport/sport.entity';

@Entity('Equipment')
export default class Equipment {
  @ApiProperty({ type: String, readOnly: true })
  @Type(() => String)
  @Transform(({ value }) => (value as Buffer).toString('base64url'))
  @PrimaryColumn({ type: 'varbinary', length: 16 })
  id!: Buffer;

  @BeforeInsert()
  uuidToBin() {
    this.id = Buffer.from(v4().replace(/-/g, ''), 'hex');
  }

  @ApiProperty()
  @Column({ type: 'varchar', length: 150 })
  name!: string;

  @ApiProperty({ type: String, nullable: true })
  @Column({ type: 'varchar', length: 256 })
  other_info!: string | null;

  @ApiProperty({ type: Boolean, nullable: true })
  @Column({ type: 'bit' })
  @Transform(({ value: buf }) => (buf ? !!(buf as Buffer).readUIntBE(0, 1) : buf))
  open_access!: boolean | null;

  @ApiProperty({ type: Boolean, nullable: true })
  @Column({ type: 'bit' })
  @Transform(({ value: buf }) => (buf ? !!(buf as Buffer).readUIntBE(0, 1) : buf))
  locker!: boolean | null;

  @ApiProperty({ type: Boolean, nullable: true })
  @Column({ type: 'bit' })
  @Transform(({ value: buf }) => (buf ? !!(buf as Buffer).readUIntBE(0, 1) : buf))
  lighting!: boolean | null;

  @ApiProperty({ type: Boolean, nullable: true })
  @Column({ type: 'bit' })
  @Transform(({ value: buf }) => (buf ? !!(buf as Buffer).readUIntBE(0, 1) : buf))
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

  @ApiProperty({ type: () => Installation, nullable: true, required: true })
  @ManyToOne(() => Installation, (installation) => installation.id, { cascade: ['insert'] })
  @JoinColumn({ name: 'id_installation' })
  installation!: Installation | null;

  @ApiProperty({ type: () => Owner })
  @ManyToOne(() => Owner, (owner) => owner.code, { cascade: false })
  @JoinColumn({ name: 'code_owner' })
  owner!: Owner | null;

  @ApiProperty({ type: () => SoilType, nullable: true })
  @ManyToOne(() => SoilType, (s_t) => s_t.code, { cascade: false })
  @JoinColumn({ name: 'code_soil_type' })
  soil_type!: SoilType | null;

  @ApiProperty({ type: () => EquipmentNature, nullable: true })
  @ManyToOne(() => EquipmentNature, (e_n) => e_n.code, { cascade: false })
  @JoinColumn({ name: 'code_equipment_nature' })
  equipment_nature!: EquipmentNature | null;

  @ApiProperty({ type: () => EquipmentType, nullable: false })
  @ManyToOne(() => EquipmentType, (e_t) => e_t.code, { cascade: false })
  @JoinColumn({ name: 'code_equipment_type' })
  equipment_type!: EquipmentType;

  @ApiProperty({ type: () => EquipmentLevel, nullable: true })
  @ManyToOne(() => EquipmentLevel, (e_l) => e_l.code, { cascade: false })
  @JoinColumn({ name: 'code_equipment_level' })
  equipment_level!: EquipmentLevel | null;

  @ApiProperty({ type: () => Sport, isArray: true })
  @ManyToMany(() => Sport, (sport) => sport.code, { cascade: false })
  @JoinTable({
    name: 'Equipment_Sport',
    inverseJoinColumn: { name: 'code_sport' },
    joinColumn: { name: 'id_equipment' }
  })
  sports!: Sport[];

  @ApiProperty({ type: () => Picture, isArray: true })
  @OneToMany(() => Picture, (pictures) => pictures.equipment, { cascade: ['insert'] })
  @JoinColumn({ name: 'id' })
  pictures!: Picture[];
}
