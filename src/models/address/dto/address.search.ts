import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmptyObject, IsOptional } from 'class-validator';
import CitySearch from '../../city/dto/city.search';

export default class AddressSearch {
  @ApiProperty({ type: String, required: false })
  @IsOptional()
  street_num?: string | null;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  street_name?: string | null;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  locality?: string | null;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  district?: number | null;

  @ApiProperty({ type: CitySearch, required: false })
  @IsNotEmptyObject()
  @Type(() => CitySearch)
  @IsOptional()
  city?: CitySearch;
}
