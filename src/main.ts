import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { LoggerService } from './shared/logger/logger.service';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v001');
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);
  app.use(helmet());

  const config = new DocumentBuilder()
    .setTitle('File Upload API')
    .setDescription('File Upload API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  const logger = new LoggerService();

  await app
    .listen(port)
    .then(() => logger.log(`Server running on port ${port}`));
}

void bootstrap();
