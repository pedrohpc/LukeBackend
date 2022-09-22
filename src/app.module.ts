import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppGateway } from './app.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Logs } from './logs.entity';
import { LogsModule } from './logs.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'ec2-52-207-90-231.compute-1.amazonaws.com',
      port: 5432,
      username: 'gatktqkyyrozaq',
      password:
        '89fde3f2b5876330bac23bbfde8d460927d0a74ffda03b2736aff1c9b7228f5a',
      database: 'd1cj41tonso4n5',
      entities: [Logs],
      synchronize: true,
      ssl: true,
    }),
    LogsModule,
  ],
  controllers: [],
  providers: [AppService, AppGateway],
})
export class AppModule {}
