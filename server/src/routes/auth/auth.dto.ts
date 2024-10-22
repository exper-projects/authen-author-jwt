import { PickType } from '@nestjs/mapped-types';
import { UserModel } from 'src/models/user.module';

export class CreateUserDto extends PickType(UserModel, [
  'username',
  'password',
  'name',
] as const) {}

export class SignInDto extends PickType(UserModel, [
  'username',
  'password',
] as const) {}
