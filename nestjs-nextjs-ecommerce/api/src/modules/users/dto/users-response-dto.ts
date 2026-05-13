import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
// The user response DTO will be sent back to the client
export class UserResponseDto {
  // the unique identifier
  @ApiProperty({
    description: 'The unique idenitifier of the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
  }) // provides metadata for Swagger API documentation
  id: string;

  // the email address of the user
  @ApiProperty({
    description: 'The email address of the user',
    example: 'john.doe@example.com',
  })
  email: string;

  // the first name of the user
  @ApiProperty({
    description: 'User first name',
    example: 'John',
    nullable: true,
  })
  firstName: string | null;

  // the last name of the user
  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
    nullable: true,
  })
  lastName: string | null;

  @ApiProperty({
    description: 'User Role',
    enum: Role,
  })
  role: Role;

  @ApiProperty({
    description: 'the timestamp for showing when the user was created',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'the timestamp for showing when the user was last updated',
    example: '2023-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}
