import { IsString } from 'class-validator';

export class TokensResponse {
  accessToken: string;
  refreshToken: string;
}

export class RevokeRefreshTokenBody {
  @IsString()
  username: string;
}
