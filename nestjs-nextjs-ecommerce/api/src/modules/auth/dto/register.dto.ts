// DTO (Data Transfer Object) is intended for user registration
// purpose:
// - improve type safety and generate API docs
// - define the shape and validation rules for the data your API expects for user registration

import { IsEmail, IsNotEmpty, IsString, MinLength, Matches, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class RegisterDto {
  // create all rules needed for user registration

  //  This decorator like @IsEmail validates that the value of the property must be an email address
  @ApiProperty({
    description: 'The email address of the user',
    example: 'john.doe@example.com',
  })
  @IsEmail({}, { message: 'Please provide a valid email address!' })
  @IsNotEmpty({ message: 'Email is required!' })
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'p@ssw0rd!',
  })
  @IsString()
  @IsNotEmpty({ message: 'Password is required!' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  // @Matches() decorator indicates that the value of the property must be a specific regular expression
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$%*?&])[A-za-z\d@$!%*?&]/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  password: string;

  @ApiProperty({
    description: 'The first name of the user',
    example: 'John',
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({
    description: 'the last name of the user',
    example: 'Doe',
  })
  @IsOptional()
  @IsString()
  lastName?: string;
}
