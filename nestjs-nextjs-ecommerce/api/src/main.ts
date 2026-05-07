import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // project description
  app.setGlobalPrefix('api/v1');

  // After that, every route in this application will start with /api/v1/*

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((error) => {
  Logger.error('Failed to start the application', error);
  process.exit(1);
});
