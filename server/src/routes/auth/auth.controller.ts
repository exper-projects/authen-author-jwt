import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GetUserFromRequest } from 'src/decorators/get-user-from-request';
import { RefreshTokenGuard } from 'src/guards/rt.guard';
import { RestrictUserInterceptor } from 'src/interceptors/restrict-user.icpt';
import { IsPublic } from 'src/metadata/public.metadata';

import { CreateUserDto, SignInDto } from './auth.dto';
import { AuthService } from './auth.service';
import { RevokeRefreshTokenBody } from './auth.types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Sign Up
   */

  @IsPublic()
  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(RestrictUserInterceptor)
  signUp(@Body() userPayload: CreateUserDto) {
    return this.authService.signUp(userPayload);
  }

  /**
   * Sign In
   */

  @IsPublic()
  @Post('sign-in')
  @UseInterceptors(RestrictUserInterceptor)
  @HttpCode(HttpStatus.OK)
  signIn(@Body() payload: SignInDto) {
    return this.authService.signIn(payload);
  }

  /**
   * Sign Out
   */

  @Post('sign-out')
  @HttpCode(HttpStatus.OK)
  signOut(@GetUserFromRequest('userId') userId: string) {
    return this.authService.signOut(userId);
  }

  /**
   * Refresh token
   */

  @IsPublic() // bypass AccessTokenGuard
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenGuard)
  refreshToken(
    @GetUserFromRequest() user: { userId: string; refreshToken: string },
  ) {
    return this.authService.refreshToken(user.userId, user.refreshToken);
  }

  /**
   * Revoke refresh token
   */

  @Post('revoke-refresh-token')
  @HttpCode(HttpStatus.OK)
  revokeRefreshToken(@Body() payload: RevokeRefreshTokenBody) {
    return this.authService.revokeRefreshToken(payload.username);
  }
}
