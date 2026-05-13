import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserResponseDto } from './dto/users-response-dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { ChangePasswordDto } from './dto/change-password-dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  private readonly SALT_ROUNDS = 12; // The private property for SALT_ROUNDS is set to 12 by default.

  // retrieve one specified user
  async findOne(userId: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        password: false, // exclude the password field from the query result for security reasons
      },
    });

    if (!user) {
      throw new NotFoundException('User Not Found!');
    }

    return user;
  }

  // retrieve all users
  async findAll(): Promise<UserResponseDto[]> {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        password: false, // exclude the password field from the query result for security reasons
      },
      orderBy: { createdAt: 'desc' }, // order the users by the createdAt field in descending order (newest users first)
    });
  }

  // update the user based on the user id and updateUserDto
  async update(
    userId: string,
    updatedUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    // First, I need to look for the existing user by the user id
    const existingUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new NotFoundException('User Not Found!');
    }

    if (updatedUserDto.email && updatedUserDto.email !== existingUser.email) {
      // if the email is being updated, and the email of the updated user is not equal to the email of the existing user,
      // we have to update the process efficiently.

      // Step 1: check whether or not the email is already in use by another user
      const emailToken = await this.prisma.user.findUnique({
        where: { email: updatedUserDto.email },
      });

      if (emailToken) {
        throw new NotFoundException('Email already in use!');
      }
    }

    // Step 2: If the email is not in use, we can update the user info by the user id
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: updatedUserDto,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        password: false, // exclude the password field from the query result for security reasons
      },
    });
    // return the updated user info
    return updatedUser;
  }

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    // Step 1: get the current password
    const { currentPassword, newPassword } = changePasswordDto;

    // Step 2: find the existing user and check whether or not the user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      // If the user is not found, I need to throw a NotFoundException error
      throw new NotFoundException('User Not Found!');
    }

    // Step 3: use bcrypt to compare the current password with the existing user's password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      existingUser.password,
    );

    if (!isPasswordValid) {
      // If the current password is incorrect, I need to throw a NotFoundException error
      throw new NotFoundException('Current password is incorrect!');
    }

    // Step 4: check if the new password is the same as the current password
    const isSamePassword = await bcrypt.compare(
      newPassword,
      existingUser.password,
    );

    if (isSamePassword) {
      // If the new password is the same as the current password, I have to throw a NotFoundException error
      throw new NotFoundException(
        'The new password must be different from the current password!',
      );
    }

    // Step 5: hash the password using SALT_ROUNDS
    //         initialize SALT_ROUNDS
    const hashedPassword = await bcrypt.hash(newPassword, this.SALT_ROUNDS);

    // Step 6: update the user's password in the database
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    // Step 7: return a success message
    return { message: 'Password changed successfully!' };
  }

  async deleteAccount(userId: string): Promise<{ message: string }> {
    // step 1: fetch the existing user by the user id
    const existingUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      // If the user is not found, I need to throw a NotFoundException error
      throw new NotFoundException('User Not Found!');
    }

    // step 2: delete the user account from the database by the user id
    await this.prisma.user.delete({
      where: { id: userId },
    });

    // step 3: output a single message to return the operation
    return { message: 'Account has been deleted successfully! ' };
  }
}
