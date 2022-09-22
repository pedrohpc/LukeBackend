import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppGateway } from './app.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Logs } from './logs.entity';
import { LogsModule } from './logs.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'password',
      database: 'luke',
      entities: [Logs],
      synchronize: true,
    }),
    LogsModule,
  ],
  controllers: [],
  providers: [AppService, AppGateway],
})
export class AppModule {}
