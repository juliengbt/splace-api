import { HeaderAPIKeyStrategy } from 'passport-headerapikey';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ApiAuthService } from './apiAuth.service';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(HeaderAPIKeyStrategy) {
  constructor(apiAuthService: ApiAuthService) {
    super(
      { header: 'apiKey', prefix: '' },
      true,
      (apikey: string, done: (arg0: boolean) => any) => {
        const checkKey = apiAuthService.validateApiKey(apikey);
        if (!checkKey) {
          return done(false);
        }
        return done(true);
      }
    );
  }
}
