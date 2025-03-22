import { RepositoryPort } from 'core'

import { ChatRoom } from './chat-room.model'

export interface ChatRoomRepositoryPort extends RepositoryPort<ChatRoom> {
  findByParticipantId(userId: string): Promise<ChatRoom[]>
}
