import { NestFastifyApplication, FastifyAdapter } from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import AppModule from 'src/app.module';

describe('SportModule (e2e)', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(new FastifyAdapter());

    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  it('/sport (GET)', () => {
    return app
      .inject({
        method: 'GET',
        url: '/sport'
      })
      .then((result) => {
        expect(result.statusCode).toEqual(200);
        expect(result.payload).toEqual([]);
      });
  });
});
