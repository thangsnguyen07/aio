import { Injectable } from '@nestjs/common'

import { Mapper } from 'core'

import { Chat } from '../../domain/chat.model'
import { ChatEntity } from '../entities/chat.entity'

interface MessageResponse {
  id: string
  roomId: string
  senderId: string
  content: string
  createdAt: string
}

@Injectable()
export class ChatMapper implements Mapper<Chat, ChatEntity, MessageResponse> {
  toPersistence(model: Chat): ChatEntity {
    const { id, createdAt, updatedAt, deletedAt } = model

    return {
      id,
      roomId: model.getProps().roomId,
      senderId: model.getProps().senderId,
      content: model.getProps().content,
      createdAt,
      updatedAt,
      deletedAt,
    }
  }

  toDomain(entity: ChatEntity): Chat {
    const { id, createdAt, updatedAt, deletedAt, ...props } = entity

    return new Chat({
      id,
      props,
      createdAt,
      updatedAt,
      deletedAt,
    })
  }

  toResponse(model: Chat): MessageResponse {
    const props = model.getProps()

    return {
      id: props.id,
      roomId: props.roomId,
      senderId: props.senderId,
      content: props.content,
      createdAt: props.createdAt.toISOString(),
    }
  }
}
