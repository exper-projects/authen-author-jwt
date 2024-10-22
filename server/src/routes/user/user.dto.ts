import { PartialType, PickType } from '@nestjs/mapped-types';
import { UserModel } from 'src/models/user.module';

export class UpdateUserDto extends PartialType(
  PickType(UserModel, ['username', 'password', 'name', 'balance'] as const),
) {}
