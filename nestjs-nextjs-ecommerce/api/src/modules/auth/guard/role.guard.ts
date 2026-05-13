// a custom guard used to control access based on the user's roles.
// purpose: check whether or not the authenticated user has the require role to access the route
import { CanActivate, Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLES_KEY } from '../../../common/decorators/roles.decorator';

export class RolesGuard implements CanActivate {
  // CanActiavte: NestJS can activate before executing the route handler.
  // It determines whether the current request is allowed to proceed.

  // inject the reflector class into the constructor using the constructor method
  constructor(private reflector: Reflector) {}

  // create a canActivate function/method
  // -> a NestJS function that decides whether the current request is allowed to proceed based on the user's roles
  canActivate(context: ExecutionContext): boolean {
    // takes ExecutionContext on NestJS abstraction that represents the current exection environment of a variable
    // returns true or false

    // If roles are defined, it extracts authenticated users from the HTTP request and checks whether the user's role
    // matches at least one of the requried roles.
    // ROLES_KEY is the list of data
    //  -> which can be implemented
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      // The roles are not found
      return true;
    }

    const { user } = context.switchToHttp().getRequest(); // get the user from the request object

    // determine whether the user roles matches one of the required roles
    // If included, the access will be requested.
    // Otherwise, the request will be block.
    return requiredRoles.some((specifiedRole) => user?.role === specifiedRole);
  }
}
