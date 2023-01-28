import { CookieSerializeOptions } from '@fastify/cookie';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { FastifyRequest } from 'fastify';
import { Strategy } from 'passport-jwt';
import { JwtPayload, JwtPayloadWithRt } from 'src/types';

export const refreshTokenCookieOptions: CookieSerializeOptions = {
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};
export const REFRESH_TOKEN_COOKIE = 'refresh-token' as const;

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: JwtRefreshStrategy.extractJWT,
      ignoreExpiration: false,
      secretOrKey: 'rt-' + process.env.JWT_SECRET,
      passReqToCallback: true
    });
  }

  private static extractJWT(req: FastifyRequest): string | null {
    if (req.cookies && req.cookies[REFRESH_TOKEN_COOKIE]) return req.cookies[REFRESH_TOKEN_COOKIE];
    return null;
  }

  async validate(req: FastifyRequest, payload: JwtPayload) {
    const refreshToken = JwtRefreshStrategy.extractJWT(req);
    if (!refreshToken) throw new ForbiddenException('Refresh token malformed');
    return {
      ...payload,
      refreshToken
    } as JwtPayloadWithRt;
  }
}
