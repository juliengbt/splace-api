import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { v4 } from 'uuid';
import City from './city.entity';

@Entity('Zipcode')
export default class Zipcode {
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
  @Column({ type: 'mediumint' })
  code!: number;

  @ApiProperty({ type: () => City, required: true })
  @ManyToOne(() => City, (city) => city.id, { cascade: false })
  @JoinColumn({ name: 'id_city' })
  city!: City;
}
