import { ApiProperty } from '@nestjs/swagger';

export class Tokens {
  @ApiProperty({ type: String })
  accessToken: string;

  @ApiProperty({ type: String })
  refreshToken: string;
}
