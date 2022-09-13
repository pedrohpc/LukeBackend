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
import { AppService } from './app.service';

@WebSocketGateway()
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');

  @SubscribeMessage('atualizarLukeStatus')
  handleEvent(@MessageBody() name: string): void {
    AppService.statusPreso = !AppService.statusPreso;
    const data = new Date();
    const dia = data.getDate().toString();
    const diaF = dia.length == 1 ? '0' + dia : dia;
    const mes = (data.getMonth() + 1).toString(); //+1 pois no getMonth Janeiro começa com zero.
    const mesF = mes.length == 1 ? '0' + mes : mes;
    const anoF = data.getFullYear();
    AppService.statusPreso
      ? AppService.logs.unshift(
          name +
            ' prendeu o Luke às ' +
            data.toLocaleTimeString('pt-BR') +
            ' do dia ' +
            diaF +
            '/' +
            mesF +
            '/' +
            anoF,
        )
      : AppService.logs.unshift(
          name +
            ' soltou o Luke às ' +
            data.toLocaleTimeString('pt-BR') +
            ' do dia ' +
            diaF +
            '/' +
            mesF +
            '/' +
            anoF,
        );
    const last10 = AppService.logs.slice(0, 10);
    this.server.emit('msgToClient', {
      statusPreso: AppService.statusPreso,
      logs: last10,
    });
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleConnection(client: Socket) {
    const last10 = AppService.logs.slice(
      Math.max(AppService.logs.length - 10, 0),
    );
    this.logger.log('ClientConnected');
    this.server.emit('ClientConnected', {
      statusPreso: AppService.statusPreso,
      logs: last10,
    });
  }

  handleDisconnect(client: Socket) {
    this.logger.log('Client disconnected');
    this.server.emit('ClientConnected', { statusConnected: false });
  }
}
