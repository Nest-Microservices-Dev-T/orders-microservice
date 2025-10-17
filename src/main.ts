import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { envs } from './config';

async function bootstrap() {
  const logger = new Logger('ORDERS-MICROSERVICE-MAIN');
  const app = await NestFactory.create(AppModule);
  await app.listen(envs.port);
  logger.log(`ORDERS-MS is runing on port: ${envs.port}`)
}
bootstrap();
