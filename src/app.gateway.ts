import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AppService } from './app.service';

@WebSocketGateway()
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');

  @SubscribeMessage('atualizarLukeStatus')
  handleMessage(): void {
    AppService.statusPreso = !AppService.statusPreso;
    console.log(AppService.statusPreso);
    this.server.emit('msgToClient', { statusPreso: AppService.statusPreso });
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleConnection(client: Socket) {
    this.logger.log('ClientConnected');
    this.server.emit('ClientConnected', {
      statusPreso: AppService.statusPreso,
    });
  }

  handleDisconnect(client: Socket) {
    this.logger.log('Client disconnected');
    this.server.emit('ClientConnected', { statusConnected: false });
  }
}
