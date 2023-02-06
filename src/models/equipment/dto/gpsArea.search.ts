import { ApiProperty } from '@nestjs/swagger';
import { IsLatitude, IsLongitude } from 'class-validator';

export default class GPSAreaSearch {
  @ApiProperty()
  @IsLongitude()
  minLongitude: number;

  @ApiProperty()
  @IsLatitude()
  minLatitude: number;

  @ApiProperty()
  @IsLongitude()
  maxLongitude: number;

  @ApiProperty()
  @IsLatitude()
  maxLatitude: number;
}
