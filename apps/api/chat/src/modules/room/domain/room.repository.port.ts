import { RepositoryPort } from 'core'

import { Room } from './room.model'

export interface RoomRepositoryPort extends RepositoryPort<Room> {
  findByParticipantId(userId: string): Promise<Room[]>
}
