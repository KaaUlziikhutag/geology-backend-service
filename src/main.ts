import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Mongolian Central Geological Laboratory')
    .setDescription('When it comes to analyzing minerals in mongolia')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors();
  app.useWebSocketAdapter(new IoAdapter(app));
  await app.listen(process.env.PORT || 8000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
