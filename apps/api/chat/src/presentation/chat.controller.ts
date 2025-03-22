import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { GrpcMethod, RpcException } from '@nestjs/microservices'

import { status } from '@grpc/grpc-js'
import {
  ChatServiceControllerMethods,
  CreateRoomRequest,
  GetMessagesRequest,
  JoinRoomRequest,
  SendMessageRequest,
} from 'proto'

import { CreateRoomCommand } from '@/domain/use-cases/commands/create-room.command'
import { JoinRoomCommand } from '@/domain/use-cases/commands/join-room.command'
import { SendMessageCommand } from '@/domain/use-cases/commands/send-message.command'
import { GetMessagesQuery } from '@/domain/use-cases/queries/get-messages.query'

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
