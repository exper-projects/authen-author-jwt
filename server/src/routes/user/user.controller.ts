import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { RestrictUserInterceptor } from 'src/interceptors/restrict-user.icpt';

import { UpdateUserDto } from './user.dto';
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

  @Get(':username')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(RestrictUserInterceptor)
  getUser(@Param('username') username: string) {
    return this.userService.getUser(username);
  }

  /**
   * Update user by username
   */

  @Post(':username/update')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(RestrictUserInterceptor)
  updateUserByUsername(
    @Param('username') username: string,
    @Body() payload: UpdateUserDto,
  ) {
    return this.userService.updateUserByUsername(username, payload);
  }
}
