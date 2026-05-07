// define a custom authentication code that protects routes using the standard JWT access token strategy

import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable() // It can be injected and reused across the application
export class JwtAuthGuard extends AuthGuard('jwt') {
  // tells NestJS to use the strategy registered under the name JWT

  constructor(private reflector: Reflector) {
    // Why?
    // Because decorators, or custom decorators, do not execute the logic by themselves.
    // only attach the metadata
    // We read the metadata at one time
    // used for guards, interceptors, and filters to access the metadata set by decorators
    super();
  }

  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  // Back to auth.controller.ts
}
