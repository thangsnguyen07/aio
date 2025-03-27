import { Paginated, PaginatedQueryParams, RepositoryPort } from 'core'

import { Chat } from './chat.model'

export interface ChatRepositoryPort extends RepositoryPort<Chat> {
  findByRoomId(roomId: string, params: PaginatedQueryParams): Promise<Paginated<Chat>>
}
