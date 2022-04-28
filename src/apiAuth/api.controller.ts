import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from 'src/auth/local-auth.gards';
import { ApiAuthService } from './apiAuth.service';

@ApiTags('Api')
@Controller('api')
export class ApiController {
  constructor(private apiAuthService: ApiAuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('register')
  async register() {
    return this.apiAuthService.getAccessToken();
  }
}
