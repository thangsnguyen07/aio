import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { RoomResponse } from 'proto'

import { ChatRoom } from '@/domain/chat-room.model'
import { ChatRoomRepositoryPort } from '@/domain/chat-room.repository.port'
import { CreateRoomCommand } from '@/domain/use-cases/commands/create-room.command'

import { ChatRoomMapper } from '@/infrastructure/mappers/chat-room.mapper'

import { InjectionToken } from '../injection-token'

@CommandHandler(CreateRoomCommand)
export class CreateRoomHandler implements ICommandHandler<CreateRoomCommand, RoomResponse> {
  constructor(
    @Inject(InjectionToken.CHAT_ROOM_REPOSITORY)
    private readonly repository: ChatRoomRepositoryPort,
    @Inject(InjectionToken.CHAT_ROOM_MAPPER) private readonly chatRoomMapper: ChatRoomMapper,
  ) {}

  async execute(command: CreateRoomCommand): Promise<RoomResponse> {
    const { name, participantIds } = command

    const chatRoom = ChatRoom.create({
      name,
      participantIds,
    })

    console.log('chatRoom', chatRoom)

    await this.repository.save(chatRoom)

    return this.chatRoomMapper.toResponse(chatRoom)
  }
}
