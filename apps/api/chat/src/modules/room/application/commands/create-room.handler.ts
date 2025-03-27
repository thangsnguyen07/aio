import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { RoomResponse } from 'proto'

import { Room } from '../../domain/room.model'
import { RoomRepositoryPort } from '../../domain/room.repository.port'
import { CreateRoomCommand } from '../../domain/use-cases/commands/create-room.command'
import { RoomMapper } from '../../infrastructure/mappers/room.mapper'
import { InjectionToken } from '../injection-token'

@CommandHandler(CreateRoomCommand)
export class CreateRoomHandler implements ICommandHandler<CreateRoomCommand, RoomResponse> {
  constructor(
    @Inject(InjectionToken.CHAT_ROOM_REPOSITORY)
    private readonly repository: RoomRepositoryPort,
    @Inject(InjectionToken.CHAT_ROOM_MAPPER) private readonly chatRoomMapper: RoomMapper,
  ) {}

  async execute(command: CreateRoomCommand): Promise<RoomResponse> {
    const { name, participantIds } = command

    const chatRoom = Room.create({
      name,
      participantIds,
    })

    console.log('chatRoom', chatRoom)

    await this.repository.save(chatRoom)

    return this.chatRoomMapper.toResponse(chatRoom)
  }
}
