import { Inject } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'

import { ChatRepositoryPort } from '@/modules/chat/domain/chat.repository.port'
import { GetMessagesQuery } from '@/modules/chat/domain/use-cases/queries/get-messages.query'
import { ChatMapper } from '@/modules/chat/infrastructure/mappers/chat.mapper'
import { GetMessagesResponse } from 'proto'

import { InjectionToken } from '../injection-token'

@QueryHandler(GetMessagesQuery)
export class GetMessagesHandler implements IQueryHandler<GetMessagesQuery, GetMessagesResponse> {
  constructor(
    @Inject(InjectionToken.CHAT_REPOSITORY) private readonly repository: ChatRepositoryPort,
    @Inject(InjectionToken.CHAT_MAPPER) private readonly chatMapper: ChatMapper,
  ) {}

  async execute(query: GetMessagesQuery): Promise<GetMessagesResponse> {
    const { roomId, limit, offset } = query

    const messages = await this.repository.findByRoomId(roomId, {
      limit,
      offset,
      page: 1,
      orderBy: { field: 'createdAt', param: 'desc' },
    })

    return {
      roomId,
      messages: messages.data.map((message) => this.chatMapper.toResponse(message)),
      limit,
      offset,
      total: messages.count,
    }
  }
}
