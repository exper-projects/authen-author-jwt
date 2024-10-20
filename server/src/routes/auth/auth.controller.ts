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
import { AccessTokenGuard } from 'src/guards/at.guard';
import { RefreshTokenGuard } from 'src/guards/rt.guard';
import { RestrictUserInterceptor } from 'src/interceptors/restrict-user.icpt';
import { IsPublic } from 'src/metadata/public.metadata';

import { CreateUserDto, SignInDto } from './auth.dto';
import { AuthService } from './auth.service';

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
}
