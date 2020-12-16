import { ApiProperty } from '@nestjs/swagger';

export default class CitySearchDTO {
  @ApiProperty({ type: String, isArray: true })
  ids!: string[];

  @ApiProperty({ type: String })
  city_name!: string;

  @ApiProperty({ type: String })
  department_num!: string;
}
