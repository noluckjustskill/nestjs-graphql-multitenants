import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Logger, PinoLogger } from 'nestjs-pino';
import 'reflect-metadata';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/errors/all-exceptions.filter';

async function bootstrap() {
  const appOptions = process.env.LOG_NESTJS_INIT_LOGS === 'true' ? {} : { logger: false };
  const app = await NestFactory.create(AppModule, appOptions);
  app.setGlobalPrefix('api');
  const pinoLogger = await app.resolve(PinoLogger);
  const logger = app.get(Logger);
  app.useLogger(logger);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter(pinoLogger));
  await app.listen(Number(process.env.APP_PORT) || 3003);
}
bootstrap();
