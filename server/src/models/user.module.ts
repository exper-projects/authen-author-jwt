import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UserModel {
  id: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  @MinLength(4)
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNumber()
  balance: number;

  @IsString()
  storedRefreshToken?: string;

  @IsDate()
  createdAt?: Date;

  @IsDate()
  updatedAt?: Date;
}
