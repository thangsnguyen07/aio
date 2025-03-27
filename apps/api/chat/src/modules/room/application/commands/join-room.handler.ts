import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { RpcException } from '@nestjs/microservices'

import { RoomRepositoryPort } from '@/modules/room/domain/room.repository.port'
import { RoomMapper } from '@/modules/room/infrastructure/mappers/room.mapper'
import { status } from '@grpc/grpc-js'
import { RoomResponse } from 'proto'

import { JoinRoomCommand } from '../../domain/use-cases/commands/join-room.command'
import { InjectionToken } from '../injection-token'

@CommandHandler(JoinRoomCommand)
export class JoinRoomHandler implements ICommandHandler<JoinRoomCommand, RoomResponse> {
  constructor(
    @Inject(InjectionToken.CHAT_ROOM_REPOSITORY)
    private readonly repository: RoomRepositoryPort,
    @Inject(InjectionToken.CHAT_ROOM_MAPPER) private readonly chatRoomMapper: RoomMapper,
  ) {}

  async execute(command: JoinRoomCommand): Promise<RoomResponse> {
    const { roomId, userId } = command

    const chatRoom = await this.repository.findOneById(roomId)

    if (!chatRoom) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: 'Room not found',
      })
    }

    // Thêm người dùng vào danh sách tham gia
    chatRoom.addParticipant(userId)

    await this.repository.save(chatRoom)

    return this.chatRoomMapper.toResponse(chatRoom)
  }
}
