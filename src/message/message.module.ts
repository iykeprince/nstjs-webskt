import { Module } from "@nestjs/common";
import { MessageService } from "./message.service";
import { MessageGateway } from "./message.gateway";

@Module({
    providers: [MessageService, MessageGateway]
})
export class MessageModule {}