// DTO for changing passqword
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, Matches } from 'class-validator';
export class ChangePasswordDto {
  @ApiProperty({
    description: 'The current password for the user',
    example: 'currentPassword123',
  })
  @IsNotEmpty({ message: 'The current password must not be empty!' })
  @IsString()
  currentPassword: string; // It must be an nonempty string

  @ApiProperty({
    description: 'The new password for the user',
    example: 'newPassword123',
    minLength: 8,
  })
  @IsNotEmpty({ message: 'The new password must not be empty!' })
  @IsString()
  @MinLength(8, {
    message: 'The new password must be at least 8 characters long!',
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$%*?&])[A-za-z\d@$!%*?&]/, {
    message:
      'The new password must contain at least one uppercase letter, one lowercase letter, one number, and one special character!',
  })
  newPassword: string; // It must be an nonempty string
}
