import { Injectable, NotFoundException, Put } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { UserModel } from 'src/models/user.module';

import { UpdateUserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get user list
   */

  async getUsers(): Promise<UserModel[]> {
    return await this.prisma.user.findMany();
  }

  /**
   * Get user detail
   */

  async getUser(username: string): Promise<UserModel> {
    return await this.prisma.user.findUnique({
      where: {
        username,
      },
    });
  }

  /**
   * Update user by id
   */

  @Put(':id/update')
  async updateUserById(
    userId: string,
    payload: UpdateUserDto,
  ): Promise<UserModel> {
    const targetUser = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!targetUser) {
      throw new NotFoundException('User not found');
    }

    return await this.prisma.user.update({
      data: payload,
      where: {
        id: userId,
      },
    });
  }
}
