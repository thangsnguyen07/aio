import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Paginated, PaginatedQueryParams } from 'core'
import { Repository } from 'typeorm'

import { ChatRoom } from '@/domain/chat-room.model'
import { ChatRoomRepositoryPort } from '@/domain/chat-room.repository.port'

import { InjectionToken } from '@/application/injection-token'

import { ChatRoomEntity } from '../entities/chat-room.entity'
import { ChatRoomMapper } from '../mappers/chat-room.mapper'

@Injectable()
export class ChatRoomRepository implements ChatRoomRepositoryPort {
  constructor(
    @InjectRepository(ChatRoomEntity) private readonly repository: Repository<ChatRoomEntity>,
    @Inject(InjectionToken.CHAT_ROOM_MAPPER) private readonly mapper: ChatRoomMapper,
  ) {}

  async findOneById(id: string): Promise<ChatRoom | null> {
    const entity = await this.repository.findOne({ where: { id } })
    if (!entity) return null

    return this.mapper.toDomain(entity)
  }

  async findByParticipantId(userId: string): Promise<ChatRoom[]> {
    const entities = await this.repository.find({
      where: {
        participantIds: userId,
      },
    })

    return entities.map((entity) => this.mapper.toDomain(entity))
  }

  async findAll(): Promise<ChatRoom[]> {
    const entities = await this.repository.find()
    return entities.map((entity) => this.mapper.toDomain(entity))
  }

  async findAllPaginated(params: PaginatedQueryParams): Promise<Paginated<ChatRoom>> {
    const [entities, total] = await this.repository.findAndCount({
      skip: params.offset,
      take: params.limit,
    })

    return {
      data: entities.map((entity) => this.mapper.toDomain(entity)),
      count: total,
      page: params.page,
      limit: params.limit,
    }
  }

  async save(chatRoom: ChatRoom): Promise<void> {
    const entity = this.mapper.toPersistence(chatRoom)
    await this.repository.save(entity)
  }

  async delete(chatRoom: ChatRoom): Promise<boolean> {
    return !!(await this.repository.delete(chatRoom.id))
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.repository.count({ where: { id } })
    return count > 0
  }

  async transaction<T>(callback: () => Promise<T>): Promise<T> {
    return this.repository.manager.transaction(callback)
  }
}
