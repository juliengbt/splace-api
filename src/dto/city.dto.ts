import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID, ValidateNested } from 'class-validator';
import DepartmentDTO from './department.dto';

export default class CityDTO {
  @ApiProperty({ type: String, required: false })
  @IsUUID()
  @IsOptional()
  id?: string;

  @ApiProperty({ type: String, required: false })
  name?: string;

  @ApiProperty({ type: Number, required: false })
  zip_code?: number;

  @ApiProperty({ type: () => DepartmentDTO, required: false })
  @ValidateNested()
  @IsOptional()
  department?: DepartmentDTO | null;
}
