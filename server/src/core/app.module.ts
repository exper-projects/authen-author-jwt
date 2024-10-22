import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from 'src/guards/at.guard';
import { AuthModule } from 'src/routes/auth/auth.module';
import { UserModule } from 'src/routes/user/user.module';

import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, AuthModule, UserModule],
  providers: [
    {
      // apply access token guard to all api, except api has IsPublic
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
})
export class AppModule {}
