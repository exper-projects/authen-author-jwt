import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/strategies/types';

import { TokensResponse } from './auth.types';

type GenerateAtRtTokens = {
  jwtService: JwtService;
  jwtPayload: JwtPayload;
};

export const generateAtRtTokens = async ({
  jwtService,
  jwtPayload,
}: GenerateAtRtTokens): Promise<TokensResponse> => {
  const [accessToken, refreshToken] = await Promise.all([
    jwtService.signAsync(jwtPayload, {
      secret: process.env.AT_SECRET,
      expiresIn: 10, // 10s
    }),
    jwtService.signAsync(jwtPayload, {
      secret: process.env.RT_SECRET,
      expiresIn: 60 * 60 * 24, // 1 day
    }),
  ]);

  return { accessToken, refreshToken };
};
