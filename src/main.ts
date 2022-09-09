import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT, function () {
    console.log('Express server listening on port %d', this.address().port);
  });
}
bootstrap();
