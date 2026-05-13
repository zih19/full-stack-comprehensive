import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

export const ROLES_KEY = 'roles'; // acts as a metadata key to store all roles on the controller

// a decorator function that takes one or more roles as arguments and uses SetMetadata for attach
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
