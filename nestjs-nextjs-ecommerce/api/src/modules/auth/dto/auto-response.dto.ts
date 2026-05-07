// Data transfer object for auto response

import { Role } from '@prisma/client';

export class AutoResponseDto {
  accessToken: string;

  refreshToken: string;

  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    // role is a collection of roles
    role: Role;
  }
}