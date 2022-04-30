import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { JwtPayload, JwtPayloadWithRt } from 'src/types';

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

  async validate(req: FastifyRequest, payload: JwtPayload) {
    const refreshToken = req.headers.authorization?.replace('Bearer', '').trim();
    if (!refreshToken) throw new ForbiddenException('Refresh token malformed');
    return {
      ...payload,
      refreshToken
    } as JwtPayloadWithRt;
  }
}
