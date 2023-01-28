import { createApp } from './app';

async function bootstrap() {
  const app = await createApp();
  await app.listen(process.env.PORT || 4000, '0.0.0.0', (err, addr) => {
    if (!err) console.info(`[${process.env.NODE_ENV}] App started on ${addr}`);
  });
}

// eslint-disable-next-line unicorn/prefer-top-level-await
bootstrap();
