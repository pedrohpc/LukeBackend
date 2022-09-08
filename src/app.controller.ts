import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
    AppService.statusPreso = false;
  }

  @Get()
  getLukePreso() {
    return { statusPreso: AppService.statusPreso };
  }

  @Post()
  PostChangeLukeStatus() {
    AppService.statusPreso = !AppService.statusPreso;
    return { statusPreso: AppService.statusPreso };
  }
}
