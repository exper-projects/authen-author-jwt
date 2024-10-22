import { NestFactory } from '@nestjs/core';
import * as cors from 'cors';

import { AppModule } from './core/app.module';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    cors({
      origin: 'http://localhost:3000',
      methods: 'GET,POST',
      credentials: true,
      allowedHeaders: 'Content-Type, Authorization',
    }),
  );

  app.setGlobalPrefix('api');

  await app.listen(4000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
