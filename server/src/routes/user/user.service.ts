import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { UserModel } from 'src/models/user.module';

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
}
