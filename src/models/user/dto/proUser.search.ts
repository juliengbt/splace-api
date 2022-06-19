import { ApiProperty } from '@nestjs/swagger';
import { IsString, NotEquals, ValidateIf } from 'class-validator';

export default class ProUserSearch {
  @ApiProperty({ type: String, required: false, nullable: false })
  @IsString()
  @NotEquals(null)
  @ValidateIf((_object, value) => value !== undefined)
  name?: string;

  @ApiProperty({ type: String, required: false, nullable: false })
  @IsString()
  @NotEquals(null)
  @ValidateIf((_object, value) => value !== undefined)
  sport?: string;

  @ApiProperty({ type: String, required: false, nullable: false })
  @IsString()
  @NotEquals(null)
  @ValidateIf((_object, value) => value !== undefined)
  category?: string;

  @ApiProperty({ type: String, required: false, nullable: false })
  @IsString()
  @NotEquals(null)
  @ValidateIf((_object, value) => value !== undefined)
  cityId?: string;
}
