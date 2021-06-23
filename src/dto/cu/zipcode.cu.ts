import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt, IsNotEmptyObject, IsOptional, Max, ValidateIf, ValidateNested
} from 'class-validator';
import IsCustomUUID from 'src/validators/uuid.validators';
import CityCU from './city.cu';

export default class ZipcodeCU {
  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsCustomUUID()
  id?: Buffer;

  @ApiProperty({ type: Number, required: true })
  @IsInt()
  @Max(100000)
  code!: number;

  @ApiProperty({ type: () => CityCU, required: true })
  @Type(() => CityCU)
  @ValidateNested()
  @IsNotEmptyObject()
  @ValidateIf((_object, value) => value !== null)
  city!: CityCU;
}
