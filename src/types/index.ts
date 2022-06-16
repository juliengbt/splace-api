import { Role } from 'src/models/user/entities/baseUser.entity';

export type JwtPayload = {
  email: string;
  role?: Role;
  sub: string;
};

export type JwtPayloadWithRt = JwtPayload & { refreshToken: string };
