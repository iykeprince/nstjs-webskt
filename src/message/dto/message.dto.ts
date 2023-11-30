import { IsEnum, IsNotEmpty } from 'class-validator';

export enum MessageType {
  TEXT = 'text',
  JSON = 'json',
}
export class MessageDto {
  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  message: string;
}
