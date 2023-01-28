import cookie from '@fastify/cookie';
import { fastifyHelmet } from '@fastify/helmet';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TestingModule } from '@nestjs/testing';
import { useContainer } from 'class-validator';
import AppModule from './app.module';

export async function createApp(testingModule?: TestingModule): Promise<NestFastifyApplication> {
  // Create app object
  const app = testingModule
    ? testingModule.createNestApplication<NestFastifyApplication>(new FastifyAdapter())
    : await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  await app.register(cookie, {
    parseOptions: {
      path: '/',
      domain: process.env.NODE_ENV == 'production' ? process.env.DOMAIN_CLIENT : 'localhost',
      secure: 'auto'
    },
    secret: process.env.COOKIE_SECRET // for cookies signature
  });
  // Register helmet for safety
  await app.register(fastifyHelmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", `'unsafe-inline'`],
        fontSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'validator.swagger.io'],
        scriptSrc: ["'self'", "https: 'unsafe-inline'"]
      }
    },
    crossOriginResourcePolicy: {
      policy: 'cross-origin'
    }
  });
  // Allow class-validator to use NestJS dependency injection container.
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // Authorizations
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Content-Length, Authorization',
    credentials: true
  });

  // Documentation
  const config = new DocumentBuilder()
    .setTitle('Splace')
    .setDescription('Splace API')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'access-token')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  return app;
}
