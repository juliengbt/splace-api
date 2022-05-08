import { AuthGuard } from '@nestjs/passport';

export class MtGuard extends AuthGuard('jwt-mail') {}
