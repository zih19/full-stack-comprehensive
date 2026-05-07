import { Body, Controller, UseGuards, Post, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { AutoResponseDto } from './dto/auto-response.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenGuard } from './guard/refresh-token.guard';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // asynchronous method for user registration
  @Post('register')
  @HttpCode(201)
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
  @HttpCode(201)
  @UseGuards(RefreshTokenGuard)
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
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  async logout(@GetUser('id') userId: string): Promise<{ message: string }> {
    // implement the logout logic in this service
    await this.authService.logout(userId);
    return { message: "Successfully logged out" };
  }

  // login
  @Post('login')
  @HttpCode(201)
  async login(@Body() loginDto: LoginDto): Promise<AutoResponseDto> {
     return await this.authService.login(loginDto);
  }
}
