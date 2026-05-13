import {
  Controller,
  UseGuards,
  Get,
  Req,
  Param,
  Patch,
  Delete,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody, // Patch & Update API route
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/role.guard';
import { UsersService } from '../users/users.service';
import { UserResponseDto } from './dto/users-response-dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { ChangePasswordDto } from './dto/change-password-dto';
import type { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { GetUser } from '../../common/decorators/get-user.decorator';

@ApiTags('users')
@ApiBearerAuth('jwt-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users') // Base route: /Users
export class UsersController {
  // Inject usersService class into the UsersController class
  // automatically provides an instance of UsersService
  constructor(private readonly usersService: UsersService) {}

  // 1st API route: get the current user's profile information
  // -> @Get decorator for defining Get Endpoint
  @Get('profile')
  // The route will be responded as /users/profile
  @ApiOperation({
    summary: 'Get user profile',
    description: 'Retrieve the profile information of the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'The user profile information has been successfully retrieved',
    type: UserResponseDto, // the shape of the response data
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid or missing JWT access token',
  }) // If the client tries to access the route without authorization, the server will respond with a 401 status code
  // RequestWithUser -> the incoming request client
  // RequestWithUser -> match the request with the user interface
  async getProfile(@Req() req: RequestWithUser): Promise<UserResponseDto> {
    return await this.usersService.findOne(req.user.id); // find the user by the user id
  }

  // 2nd API route: get all users for admin purpose only
  @Get()
  @Roles(Role.ADMIN) // only the user with the ADMIN role can access this route
  @ApiOperation({
    summary: 'Get all users',
    description: 'Retrieve a list of all users (Admin only)',
  })
  @ApiResponse({
    status: 200,
    description: 'A list of all users has been successfully retrieved',
    type: [UserResponseDto], // the shape of the response data is an array of UsersResponseDto
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async findAll(): Promise<UserResponseDto[]> {
    return await this.usersService.findAll();
  }

  // 3rd API route: get a specific user by id for admin purpose only
  @Get(':id') // map an HTTP get request with a dynamic route parameter
  //         // meaning: The value in that position of URL is tweeted as a parameter: /users/:id
  @Roles(Role.ADMIN) // That URL is only accessible to the user with the ADMIN role
  @ApiOperation({
    summary: 'Get user by ID',
    description:
      'Retrieve a specific user by their unique identifier (Admin only)',
  })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully retrieved',
    type: UserResponseDto, // the shape of the response data
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'User Not Found',
  })
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    return await this.usersService.findOne(id);
  }

  // 4th API route: update ID API route
  // The method we are going to focus on is Patch rather than Get
  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile'})
  @ApiBody({ type: UpdateUserDto }) // document the expected request body for an endpoint in Swagger API documentation
  //                              // We have to create UpdateUserDto to define the shape of the request body
  @ApiResponse({
    status: 200,
    description: 'The user profile has been successfully updated',
    type: UserResponseDto, // the shape of the response data
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 400,
    description: 'Email already in use',
  })
  async updateProfile(
    userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return await this.usersService.update(userId, updateUserDto);
  }

  // 5th API route: change the current user's password
  @Patch('me/password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change the current user password!'})
  @ApiResponse({
    status: 200,
    description: 'The user password has been successfully changed',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async changePassword(
    @GetUser('id') userId: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    return await this.usersService.changePassword(userId, changePasswordDto);
  }

  // 6th API route: delete the current user's account
  @Delete('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete the current user account!' })
  @ApiResponse({
    status: 200,
    description: 'The user account has been deleted successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async deleteAccount(
    @GetUser('id') userId: string,
  ): Promise<{ message: string }> {
    return await this.usersService.deleteAccount(userId);
  }

  // 7th API route: delete the user account by id for admin purpose only
  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete user account by ID',
    description:
      'Delete a user account by their unique identifier (Admin only)',
  })
  @ApiResponse({
    status: 200,
    description: 'The user account has been deleted successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async deleteUser(@Param('id') userId: string): Promise<{ message: string }> {
    return await this.usersService.deleteAccount(userId);
  }
}
