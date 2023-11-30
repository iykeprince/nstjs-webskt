import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  Logger,
  UseFilters,
  UsePipes,
  ValidationPipe,
  WsExceptionFilter,
} from '@nestjs/common';
import {
  BaseWsExceptionFilter,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';
import { MessageService } from './message.service';
import {
  RECEIVE_MESSAGE,
  RECEIVE_TEXT_MESSAGE,
  SEND_MESSSAGE,
  SEND_TEXT_MESSAGE,
} from 'src/common/constants';
import { MessageDto } from './dto/message.dto';

@Catch(BadRequestException)
export class AllExceptionsFilter extends BaseWsExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const properError = new WsException(exception.getResponse());
    console.log('exception: ', exception.getResponse());
    super.catch(properError, host);
  }
}

@UsePipes(new ValidationPipe({ whitelist: true }))
@WebSocketGateway({
  namespace: '/message',
  cors: {
    origin: '*',
  },
})
export class MessageGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(MessageGateway.name);
  constructor(private messageService: MessageService) {}

  @WebSocketServer() io: Namespace;

  afterInit(server: any) {
    this.logger.log(`ChatGateway is initialized...`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: user id ${client.id}`);
    this.logger.log(`client size: ${this.io.sockets.size}`);
  }

  // handle plain text messages
  @SubscribeMessage(SEND_TEXT_MESSAGE)
  async handleSendTextMessage(client: Socket, payload: string) {
    const messageResponse = await this.messageService.sendTextMessage(payload);
    this.io.emit(RECEIVE_TEXT_MESSAGE, messageResponse);
  }

  // handle json object messages
  @UseFilters(new AllExceptionsFilter())
  @SubscribeMessage(SEND_MESSSAGE)
  async handleSendMessage(client: Socket, payload: MessageDto) {
    console.log('payload', payload);
    const messageResponse = await this.messageService.sendMessage(payload);
    console.log('message response', messageResponse);
    this.io.emit(RECEIVE_MESSAGE, messageResponse);
  }

  handleDisconnect(client: any) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.logger.log(`client size: ${this.io.sockets.size}`);
    // throw new WsException(`Client disconnected`);
  }
}
