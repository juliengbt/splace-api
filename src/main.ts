import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import fastifyHelmet from 'fastify-helmet';
import AppModule from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.useGlobalPipes(new ValidationPipe({
    transformOptions: { enableImplicitConversion: true },
    transform: true
  }));

  await app.register(fastifyHelmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ['\'self\''],
        styleSrc: ['\'self\'', '\'unsafe-inline\'', 'cdn.jsdelivr.net', 'fonts.googleapis.com'],
        fontSrc: ['\'self\'', 'fonts.gstatic.com'],
        imgSrc: ['\'self\'', 'data:', 'cdn.jsdelivr.net'],
        scriptSrc: ['\'self\'', 'https: \'unsafe-inline\'', 'cdn.jsdelivr.net']
      }
    }
  });

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Content-Length'
  });

  const options = new DocumentBuilder()
    .setTitle('Splace API')
    .setDescription('Documentation for SplaceAPI')
    .setVersion('1.0')
    .addTag('Splace')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('doc', app, document);

  await app.listen(parseInt(process.env.SERVER_PORT) || 8000);
}
bootstrap();
