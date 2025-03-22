import { Injectable } from '@nestjs/common'

import { Mapper } from 'core'

import { ChatRoom } from '@/domain/chat-room.model'

import { ChatRoomEntity } from '../entities/chat-room.entity'

interface RoomResponse {
  id: string
  name: string
  participantIds: string[]
}

@Injectable()
export class ChatRoomMapper implements Mapper<ChatRoom, ChatRoomEntity, RoomResponse> {
  toPersistence(model: ChatRoom): ChatRoomEntity {
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

  toDomain(entity: ChatRoomEntity): ChatRoom {
    const { id, createdAt, updatedAt, deletedAt, ...props } = entity

    return new ChatRoom({
      id,
      props,
      createdAt,
      updatedAt,
      deletedAt,
    })
  }

  toResponse(model: ChatRoom): RoomResponse {
    const props = model.getProps()
    return {
      id: props.id,
      ...props,
    }
  }
}
