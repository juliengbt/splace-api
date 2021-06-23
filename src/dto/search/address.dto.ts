import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import CityDTO from './city.dto';

export default class AddressDTO {
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

  @ApiProperty({ type: CityDTO, required: false })
  @IsOptional()
  city?: CityDTO;
}