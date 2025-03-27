import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { commandHandlers } from './application/commands'
import { InjectionToken } from './application/injection-token'
import { queryHandlers } from './application/queries'

import { ChatEntity } from './infrastructure/entities/chat.entity'
import { ChatMapper } from './infrastructure/mappers/chat.mapper'
import { ChatRepository } from './infrastructure/repositories/chat.repository'

@Module({
  imports: [TypeOrmModule.forFeature([ChatEntity])],
  providers: [
    {
      provide: InjectionToken.CHAT_REPOSITORY,
      useClass: ChatRepository,
    },
    {
      provide: InjectionToken.CHAT_MAPPER,
      useClass: ChatMapper,
    },
    ...commandHandlers,
    ...queryHandlers,
  ],
})
export class ChatModule {}
