import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';

@Injectable()
export class ApiAuthService {
  constructor(private jwtService: JwtService) {}

  validateApiKey(apiKey: string) {
    return apiKey === process.env.API_KEY;
  }

  async getAccessToken() {
    return {
      access_token: this.jwtService.sign(randomBytes(16))
    };
  }
}
