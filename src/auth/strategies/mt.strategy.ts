import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JwtPayload } from 'src/types';

@Injectable()
export class JwtMailStrategy extends PassportStrategy(Strategy, 'jwt-mail') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'mt-' + process.env.JWT_SECRET
    });
  }

  async validate(payload: JwtPayload) {
    return payload;
  }
}
