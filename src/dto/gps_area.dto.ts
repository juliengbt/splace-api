import { ApiProperty } from '@nestjs/swagger';
import { IsLatitude, IsLongitude } from 'class-validator';

export default class GPSAreaDTO {
  @ApiProperty()
  @IsLongitude()
  min_lon!: number;

  @ApiProperty()
  @IsLatitude()
  min_lat!: number;

  @ApiProperty()
  @IsLongitude()
  max_lon!: number;

  @ApiProperty()
  @IsLatitude()
  max_lat!: number;

  @ApiProperty()
  @IsLatitude()
  previous_area?: GPSAreaDTO;
}
