import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const logger = new Logger('bootstrap');
  const port = 3000;
  await app.listen(port);
  logger.log(`Server started on port ${port}`);
}

bootstrap();
