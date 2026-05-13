import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'The email address of the user',
    example: 'john.doe@example.com',
  })
  @IsEmail({}, { message: 'Please provide a valid email address!' })
  @IsNotEmpty({ message: 'Email is required!' })
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'p@ssW0rd!',
  })
  @IsString()
  @IsNotEmpty({ message: 'Password is required!' })
  password: string;
}