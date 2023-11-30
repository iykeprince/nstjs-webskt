import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SocketIOAdapter } from './socket-io-adapter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new SocketIOAdapter(app));
  const port = 3000;
  await app.listen(process.env.PORT || port);
}
bootstrap();
