import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Chat } from '@/modules/chat/domain/chat.model'
import { ChatRepositoryPort } from '@/modules/chat/domain/chat.repository.port'
import { Paginated, PaginatedQueryParams } from 'core'
import { Repository } from 'typeorm'

import { InjectionToken } from '../../application/injection-token'
import { ChatEntity } from '../entities/chat.entity'
import { ChatMapper } from '../mappers/chat.mapper'

@Injectable()
export class ChatRepository implements ChatRepositoryPort {
  constructor(
    @InjectRepository(ChatEntity) private readonly chatRepository: Repository<ChatEntity>,
    @Inject(InjectionToken.CHAT_MAPPER) private readonly chatMapper: ChatMapper,
  ) {}

  async findByRoomId(roomId: string, params: PaginatedQueryParams): Promise<Paginated<Chat>> {
    const [entities, total] = await this.chatRepository.findAndCount({
      where: { roomId },
      skip: params.offset,
      take: params.limit,
      order: { createdAt: 'DESC' },
    })

    return {
      data: entities.map((entity) => this.chatMapper.toDomain(entity)),
      count: total,
      page: params.page,
      limit: params.limit,
    }
  }

  async findOneById(id: string): Promise<Chat | null> {
    const entity = await this.chatRepository.findOneBy({ id })
    return entity ? this.chatMapper.toDomain(entity) : null
  }

  async save(model: Chat | Chat[]): Promise<void> {
    const models = Array.isArray(model) ? model : [model]
    const entities = models.map((m) => this.chatMapper.toPersistence(m))
    await this.chatRepository.save(entities)
  }

  findAll(): Promise<Chat[]> {
    throw new Error('Method not implemented.')
  }

  async findAllPaginated(params: PaginatedQueryParams): Promise<Paginated<Chat>> {
    const [entities, total] = await this.chatRepository.findAndCount({
      skip: params.offset,
      take: params.limit,
    })

    return {
      data: entities.map((entity) => this.chatMapper.toDomain(entity)),
      count: total,
      page: params.page,
      limit: params.limit,
    }
  }

  delete(entity: Chat): Promise<boolean> {
    throw new Error('Method not implemented.')
  }

  transaction<T>(handler: () => Promise<T>): Promise<T> {
    throw new Error('Method not implemented.')
  }
}
