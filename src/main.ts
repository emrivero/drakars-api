import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfigService } from './config/app/config.service';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appConfig: AppConfigService = app.get('AppConfigService');
  app.useGlobalPipes(new ValidationPipe());

  const options = new DocumentBuilder()
  .setTitle('Starter Framework Api')
  .setVersion('1.0')
  .addTag('starter-framework')
  .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('apidocs', app, document);

  await app.listen(appConfig.port);
}
bootstrap();
