import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'rt-' + process.env.JWT_SECRET,
      passReqToCallback: true
    });
  }

  async validate(req: FastifyRequest, payload: any) {
    const refreshToken = req.headers.authorization?.replace('Bearer', '').trim();
    return {
      ...payload,
      refreshToken
    };
  }
}
