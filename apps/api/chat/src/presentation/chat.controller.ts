import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { GrpcMethod, RpcException } from '@nestjs/microservices'

import { SendMessageCommand } from '@/modules/chat/domain/use-cases/commands/send-message.command'
import { GetMessagesQuery } from '@/modules/chat/domain/use-cases/queries/get-messages.query'
import { CreateRoomCommand } from '@/modules/room/domain/use-cases/commands/create-room.command'
import { JoinRoomCommand } from '@/modules/room/domain/use-cases/commands/join-room.command'
import { status } from '@grpc/grpc-js'
import {
  ChatServiceControllerMethods,
  CreateRoomRequest,
  GetMessagesRequest,
  JoinRoomRequest,
  SendMessageRequest,
} from 'proto'

@ChatServiceControllerMethods()
export class ChatController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @GrpcMethod('ChatService', 'SendMessage')
  async sendMessage(data: SendMessageRequest, metadata: any) {
    const senderId = metadata.get('user-id')[0]
    if (!senderId) {
      throw new RpcException({
        code: status.UNAUTHENTICATED,
        message: 'User ID is required in metadata',
      })
    }

    const command = new SendMessageCommand({
      ...data,
      senderId,
    })
    return await this.commandBus.execute(command)
  }

  @GrpcMethod('ChatService', 'GetMessages')
  async getMessages(data: GetMessagesRequest) {
    const query = new GetMessagesQuery(data)
    return await this.queryBus.execute(query)
  }

  @GrpcMethod('ChatService', 'CreateRoom')
  async createRoom(data: CreateRoomRequest) {
    const command = new CreateRoomCommand(data)
    return await this.commandBus.execute(command)
  }

  @GrpcMethod('ChatService', 'JoinRoom')
  async joinRoom(data: JoinRoomRequest, metadata: any) {
    const userId = metadata.get('user-id')[0]
    if (!userId) {
      throw new RpcException({
        code: status.UNAUTHENTICATED,
        message: 'User ID is required in metadata',
      })
    }
    const command = new JoinRoomCommand({
      ...data,
      userId,
    })
    return await this.commandBus.execute(command)
  }
}
