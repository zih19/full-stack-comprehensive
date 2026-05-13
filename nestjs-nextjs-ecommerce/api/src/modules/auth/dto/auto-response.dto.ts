// Data transfer object for auto response

import { Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class AutoResponseDto {
  @ApiProperty({
    description: 'The access token for authentication',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMyIsImVtYWlsIjoiam9obi5kb2VAZXhhbXBsZS5jb20iLCJpYXQiOjE2ODg4ODg4ODgsImV4cCI6MTY4ODg4OTQ4OH0.abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567890',
  })
  accessToken: string;

  @ApiProperty({
    description: 'The refresh token for obtaining new access tokens',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMyIsImVtYWlsIjoiam9obi5kb2VAZXhhbXBsZS5jb20iLCJpYXQiOjE2ODg4ODg4ODgsImV4cCI6MTY4ODg4OTQ4OH0.def456ghi789jkl012mno345pqr678stu901vwx234yz567890',
  })
  refreshToken: string;

  @ApiProperty({
    description: 'The authenticated user details',
    example: {
      id: '123',
      email: '<email>',
      firstName: 'John',
      lastName: 'Doe',
      role: 'USER',
    },
  })
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    // role is a collection of roles
    role: Role;
  };
}
