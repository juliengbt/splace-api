import { ApiProperty } from '@nestjs/swagger';
import { IsLatitude, IsLongitude, ValidateNested } from 'class-validator';

export default class GPSAreaSearch {
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

  @ApiProperty({ required: false })
  @ValidateNested()
  previous_area?: GPSAreaSearch;
}
