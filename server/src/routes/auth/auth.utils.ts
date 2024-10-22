import { JwtService } from '@nestjs/jwt';

import { TokensResponse } from './auth.types';

type GenerateAtRtTokens = {
  jwtService: JwtService;
  jwtPayload: {
    userId: string;
    username: string;
  };
};

export const generateAtRtTokens = async ({
  jwtService,
  jwtPayload,
}: GenerateAtRtTokens): Promise<TokensResponse> => {
  const [accessToken, refreshToken] = await Promise.all([
    jwtService.signAsync(jwtPayload, {
      secret: process.env.AT_SECRET,
      expiresIn: 10, //10s
    }),
    jwtService.signAsync(jwtPayload, {
      secret: process.env.RT_SECRET,
      expiresIn: 60 * 60 * 24, // 1 week
    }),
  ]);

  return { accessToken, refreshToken };
};
