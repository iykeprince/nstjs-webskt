import { Injectable, Logger } from '@nestjs/common';
import { MessageDto } from './dto/message.dto';

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);

  async sendMessage(payload: MessageDto) {
    this.logger.log('[MessageService] sendMessage', payload);
    // Todo: handle some business logic
    return payload;
  }

  async sendTextMessage(payload: string) {
    this.logger.log('[MessageService] sendTextMessage', payload);
    // Todo: handle some business logic
    return payload;
  }
}
