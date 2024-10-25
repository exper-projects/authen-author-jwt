import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { UserModel } from 'src/models/user.module';
import { hashStr } from 'src/utils/hash';

import { CreateUserDto, SignInDto } from './auth.dto';
import { TokensResponse } from './auth.types';
import { generateAtRtTokens } from './auth.utils';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  /**
   * Sign up
   */

  async signUp(payload: CreateUserDto): Promise<UserModel> {
    const hashedPassword = await hashStr(payload.password);

    const createdUser = await this.prisma.user.create({
      data: {
        ...payload,
        password: hashedPassword,
      },
    });

    return createdUser;
  }

  /**
   * Sign In
   */

  async signIn(payload: SignInDto): Promise<TokensResponse & UserModel> {
    const targetUser = await this.prisma.user.findUnique({
      where: {
        username: payload.username,
      },
    });

    if (!targetUser) {
      throw new NotFoundException('User cannot be found');
    }

    const isPasswordMatched = await bcrypt.compare(
      payload.password,
      targetUser.password,
    );

    if (!isPasswordMatched) {
      throw new ForbiddenException('Password is incorrect');
    }

    const tokens = await generateAtRtTokens({
      jwtService: this.jwtService,
      jwtPayload: {
        userId: targetUser.id,
        username: targetUser.username,
      },
    });

    await this.setRefreshTokenToSignedInUser(
      targetUser.id,
      tokens.refreshToken,
    );

    return {
      ...targetUser,
      ...tokens,
    };
  }

  /**
   * Sign Out
   */

  async signOut(userId: string) {
    await this.prisma.user.update({
      data: {
        storedRefreshToken: null,
      },
      where: {
        id: userId,
        storedRefreshToken: {
          not: null,
        },
      },
    });
  }

  /**
   * Refresh token
   */

  async refreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<TokensResponse> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user || !user.storedRefreshToken) {
      throw new ForbiddenException('Forbidden access');
    }

    const isRefreshTokenValid = await this.jwtService.verify(refreshToken, {
      secret: process.env.RT_SECRET,
    });

    if (!isRefreshTokenValid) {
      throw new ForbiddenException('Refresh token is invalid');
    }

    const isRefreshTokenMatched = await bcrypt.compare(
      refreshToken,
      user.storedRefreshToken,
    );

    if (!isRefreshTokenMatched) {
      throw new ForbiddenException('Refresh token is not matched');
    }

    const newTokens = await generateAtRtTokens({
      jwtService: this.jwtService,
      jwtPayload: {
        userId: user.id,
        username: user.username,
      },
    });

    await this.setRefreshTokenToSignedInUser(user.id, newTokens.refreshToken);
    return newTokens;
  }

  /**
   * Revoke refresh token
   */

  async revokeRefreshToken(username: string) {
    const targetUser = await this.prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (!targetUser) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.update({
      data: {
        storedRefreshToken: '',
      },
      where: {
        id: targetUser.id,
      },
    });
  }

  /**
   * Utilities
   */

  async setRefreshTokenToSignedInUser(userId: string, refreshToken: string) {
    const hashedRefreshToken = await hashStr(refreshToken);
    await this.prisma.user.update({
      data: {
        storedRefreshToken: hashedRefreshToken,
      },
      where: {
        id: userId,
      },
    });
  }
}
