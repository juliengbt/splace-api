import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import City from '../city/city.entity';

@Entity()
export default class Zipcode {
  @ApiProperty({ type: () => String })
  @PrimaryColumn({ type: 'varbinary', length: 16 })
  @Type(() => String)
  @Transform(({ value }) => (value as Buffer).toString('base64url'))
  id: Buffer;

  @ApiProperty()
  @Column({ type: 'mediumint' })
  code: number;

  @ApiProperty({ type: () => City, required: true })
  @ManyToOne(() => City, (city) => city.zipcodes, { cascade: false })
  @JoinColumn({ foreignKeyConstraintName: 'fk_zipcode_city' })
  city: City;
}
