import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { Chat } from '@/modules/chat/domain/chat.model'
import { ChatRepositoryPort } from '@/modules/chat/domain/chat.repository.port'
import { SendMessageCommand } from '@/modules/chat/domain/use-cases/commands/send-message.command'
import { ChatMapper } from '@/modules/chat/infrastructure/mappers/chat.mapper'
import { MessageResponse } from 'proto'

import { InjectionToken } from '../injection-token'

@CommandHandler(SendMessageCommand)
export class SendMessageHandler implements ICommandHandler<SendMessageCommand, MessageResponse> {
  constructor(
    @Inject(InjectionToken.CHAT_REPOSITORY) private readonly repository: ChatRepositoryPort,
    @Inject(InjectionToken.CHAT_MAPPER) private readonly chatMapper: ChatMapper,
  ) {}

  async execute(command: SendMessageCommand): Promise<MessageResponse> {
    const { roomId, senderId, content } = command

    const chat = Chat.create({
      roomId,
      senderId,
      content,
    })

    await this.repository.save(chat)

    return this.chatMapper.toResponse(chat)
  }
}
