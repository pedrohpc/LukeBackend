import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT || 3000, function () {
    console.log('Express server listening on port %d', this.address().port);
  });
}
bootstrap();
