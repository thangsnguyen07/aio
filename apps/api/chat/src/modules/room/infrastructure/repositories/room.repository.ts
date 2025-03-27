import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Paginated, PaginatedQueryParams } from 'core'
import { Repository } from 'typeorm'

import { InjectionToken } from '../../application/injection-token'
import { Room } from '../../domain/room.model'
import { RoomRepositoryPort } from '../../domain/room.repository.port'
import { RoomEntity } from '../entities/room.entity'
import { RoomMapper } from '../mappers/room.mapper'

@Injectable()
export class RoomRepository implements RoomRepositoryPort {
  constructor(
    @InjectRepository(RoomEntity) private readonly repository: Repository<RoomEntity>,
    @Inject(InjectionToken.CHAT_ROOM_MAPPER) private readonly mapper: RoomMapper,
  ) {}

  async findOneById(id: string): Promise<Room | null> {
    const entity = await this.repository.findOne({ where: { id } })
    if (!entity) return null

    return this.mapper.toDomain(entity)
  }

  async findByParticipantId(userId: string): Promise<Room[]> {
    const entities = await this.repository.find({
      where: {
        participantIds: userId,
      },
    })

    return entities.map((entity) => this.mapper.toDomain(entity))
  }

  async findAll(): Promise<Room[]> {
    const entities = await this.repository.find()
    return entities.map((entity) => this.mapper.toDomain(entity))
  }

  async findAllPaginated(params: PaginatedQueryParams): Promise<Paginated<Room>> {
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

  async save(chatRoom: Room): Promise<void> {
    const entity = this.mapper.toPersistence(chatRoom)
    await this.repository.save(entity)
  }

  async delete(chatRoom: Room): Promise<boolean> {
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
