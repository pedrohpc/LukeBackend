import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logs } from './logs.entity';

@Injectable()
export class LogsService {
  constructor(
    @InjectRepository(Logs)
    private LogsRepository: Repository<Logs>,
  ) {}

  findAll(): Promise<Logs[]> {
    return this.LogsRepository.find({
      take: 10,
      order: { id: 'DESC' },
      select: { nome: true, id: false, data: true, status: true },
    });
  }

  findLastStatus(): Promise<Logs[]> {
    return this.LogsRepository.find({
      take: 1,
      order: { id: 'DESC' },
      select: { status: true },
    });
  }

  createLog(log: Omit<Logs, 'id'>): Promise<Logs> {
    return this.LogsRepository.save(log);
  }
}
