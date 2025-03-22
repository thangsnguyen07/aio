import { Module, Provider } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { CqrsModule } from '@nestjs/cqrs'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CoreModule, GrpcLoggingInterceptor } from 'core'

import { commandHandlers } from './application/commands'
import { InjectionToken } from './application/injection-token'
import { queryHandlers } from './application/queries'

import { ChatRoomEntity } from './infrastructure/entities/chat-room.entity'
import { ChatEntity } from './infrastructure/entities/chat.entity'
import { ChatRoomMapper } from './infrastructure/mappers/chat-room.mapper'
import { ChatMapper } from './infrastructure/mappers/chat.mapper'
import { ChatRoomRepository } from './infrastructure/repositories/chat-room.repository'
import { ChatRepository } from './infrastructure/repositories/chat.repository'

import { ChatController } from './presentation/chat.controller'

import { dataSourceOptions } from './configs/typeorm.config'

const providers: Provider[] = [
  {
    provide: APP_INTERCEPTOR,
    useClass: GrpcLoggingInterceptor,
  },
  {
    provide: InjectionToken.CHAT_REPOSITORY,
    useClass: ChatRepository,
  },
  {
    provide: InjectionToken.CHAT_MAPPER,
    useClass: ChatMapper,
  },
  {
    provide: InjectionToken.CHAT_ROOM_REPOSITORY,
    useClass: ChatRoomRepository,
  },
  {
    provide: InjectionToken.CHAT_ROOM_MAPPER,
    useClass: ChatRoomMapper,
  },
]

const application = [...queryHandlers, ...commandHandlers]

@Module({
  imports: [
    CoreModule,
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    CqrsModule,
    TypeOrmModule.forFeature([ChatEntity, ChatRoomEntity]),
    TypeOrmModule.forRoot(dataSourceOptions),
  ],
  controllers: [ChatController],
  providers: [...providers, ...application],
})
export class ChatModule {}
