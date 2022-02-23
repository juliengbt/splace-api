import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('Soil_Type')
export default class SoilType {
  @ApiProperty()
  @PrimaryColumn({ type: 'varchar', length: 10 })
    code!: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 45 })
    label!: string;
}
