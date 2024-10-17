import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import * as compression from 'compression';
import { VersioningType } from '@nestjs/common';

const corsOptions: CorsOptions = {
  origin: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'], // Allow specific HTTP methods
  allowedHeaders: ['*'], // Allow specific headers
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(compression()); // use compression to improve speed
  app.enableCors(corsOptions);
  app.setGlobalPrefix('api');
  
  // Enable versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });

  const config = new DocumentBuilder()
    .setTitle('Hope API')
    .setDescription('The Hope API description')
    .setVersion('1.0')
    .addBearerAuth() 
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3002);
}
bootstrap();
