import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  MessageBody,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { LogsService } from './logs.service';

@WebSocketGateway()
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly logsService: LogsService) {}

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');

  @SubscribeMessage('atualizarLukeStatus')
  async handleEvent(@MessageBody() name: string) {
    const dataAtual = new Date();
    const lukePreso = await this.logsService.findLastStatus();
    await this.logsService.createLog({
      nome: name,
      data: dataAtual,
      status: !lukePreso[0]?.status,
    });
    const last10 = await this.logsService.findAll();
    this.server.emit('msgToClient', {
      statusPreso: !lukePreso[0]?.status,
      logs: last10,
    });
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  async handleConnection(client: Socket) {
    const last10 = await this.logsService.findAll();
    const lukePreso = await this.logsService.findLastStatus();
    this.logger.log('ClientConnected');
    this.server.emit('ClientConnected', {
      statusPreso: lukePreso[0]?.status,
      logs: last10,
    });
  }

  handleDisconnect(client: Socket) {
    this.logger.log('Client disconnected');
    this.server.emit('ClientConnected', { statusConnected: false });
  }
}
