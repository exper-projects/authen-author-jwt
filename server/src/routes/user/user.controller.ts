import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { RestrictUserInterceptor } from 'src/interceptors/restrict-user.icpt';
import { IsPublic } from 'src/metadata/public.metadata';

import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  /**
   * Get user list
   */

  @Get('list')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(RestrictUserInterceptor)
  getUsers() {
    return this.userService.getUsers();
  }

  /**
   * Get user detail
   */

  @IsPublic()
  @Get(':username')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(RestrictUserInterceptor)
  getUser(@Param('username') username: string) {
    return this.userService.getUser(username);
  }
}
