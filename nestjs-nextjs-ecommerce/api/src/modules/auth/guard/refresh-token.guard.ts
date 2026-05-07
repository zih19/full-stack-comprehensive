// the guard for protecting refresh tokens and endpoints
import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt-refresh') {
  // extends AuthGuard to tell the passport to use the strategy registered under 'jwt-refresh'
}
