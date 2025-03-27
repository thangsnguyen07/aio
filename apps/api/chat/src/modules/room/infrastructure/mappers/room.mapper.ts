import { Injectable } from '@nestjs/common'

import { Room } from '@/modules/room/domain/room.model'
import { Mapper } from 'core'

import { RoomEntity } from '../entities/room.entity'

interface RoomResponse {
  id: string
  name: string
  participantIds: string[]
}

@Injectable()
export class RoomMapper implements Mapper<Room, RoomEntity, RoomResponse> {
  toPersistence(model: Room): RoomEntity {
    const { id, createdAt, updatedAt, deletedAt } = model

    return {
      id,
      name: model.getProps().name,
      participantIds: model.getProps().participantIds,
      createdAt,
      updatedAt,
      deletedAt,
    }
  }

  toDomain(entity: RoomEntity): Room {
    const { id, createdAt, updatedAt, deletedAt, ...props } = entity

    return new Room({
      id,
      props,
      createdAt,
      updatedAt,
      deletedAt,
    })
  }

  toResponse(model: Room): RoomResponse {
    const props = model.getProps()
    return {
      id: props.id,
      ...props,
    }
  }
}
