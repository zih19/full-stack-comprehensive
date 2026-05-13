import {
  Body,
  Controller,
  UseGuards,
  Post,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { AutoResponseDto } from './dto/auto-response.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenGuard } from './guard/refresh-token.guard';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // asynchronous method for user registration
  @Post('register')
  @HttpCode(201)
  @ApiOperation({
    summary: 'Register a new user',
    description: 'create a new user account',
  })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: AutoResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Validation failed or email already exists. ',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error'
  })
  @ApiResponse({
    status: 429,
    description: 'Too Many Requests. Rate Limit Exceeded',
  })
  async register(@Body() registerDto: RegisterDto): Promise<AutoResponseDto> {
    return await this.authService.register(registerDto);
  }

  // refresh access token method
  // useGuards() is a decorator used to control access to routes by deciding whether a request is allowed to reach the controller
  // At runtime, the guard runs before your route handler.
  // It inspects the incoming request and returns either true to allow the request or false to block the request.
  // be commonly used in authentication and authorization scenarios to protect routes
  // 2 types of guards
  //   -> authentication guard: JWT, refresh token (verify who the user is)
  //   -> authorization guard: role, permission (verify what the user is allowed to do)
  // tell NestJS to protect this route with the refresh token authentication logic
  // create a refreshTokenGuard class: guards/refresh-token.guard.ts
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenGuard)
  @ApiOperation({
    summary: 'Refresh access token',
    description: 'Generate a new access token using a valid refresh token',
  })
  @ApiResponse({
    status: 200,
    description: 'New access token generated successfully',
    type: AutoResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid or expired refreshed token',
  })
  @ApiResponse({
    status: 429,
    description: 'Too Many Requests. Rate Limit Exceeded',
  })
  async refresh(@GetUser('id') userId: string): Promise<AutoResponseDto> {
    // @GetUser('id') -> get the user with the argument id
    //                -> expect the client to send the JWT access token
    // create a folder called common to implement @GetUser() decorator
    //   common/decorators/get-user.decorator.ts

    // create a new function called refreshTokens in auth.service.ts
    return await this.authService.refreshTokens(userId);
  }

  // log out the user and invalidate the refresh token by removing it from the database
  // purpose: handle logout authenticated user
  // -> only the user with a valid access token can access this endpoint because the user's identity is already verified.
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Logout user',
    description: 'Logs out the user and invalidates the refresh token',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully logged out',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid or expired access token',
  })
  @ApiResponse({
    status: 429,
    description: 'Too Many Requests. Rate Limit Exceeded',
  })
  async logout(@GetUser('id') userId: string): Promise<{ message: string }> {
    // implement the logout logic in this service
    await this.authService.logout(userId);
    return { message: "Successfully logged out" };
  }

  // login
  @Post('login')
  @ApiOperation({
    summary: 'Login user',
    description: 'Authenticate user and return access and refresh tokens',
  })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully',
    type: AutoResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid email or password',
  })
  @ApiResponse({
    status: 429,
    description: 'Too Many Requests. Rate Limit Exceeded',
  })
  async login(@Body() loginDto: LoginDto): Promise<AutoResponseDto> {
     return await this.authService.login(loginDto);
  }
}
