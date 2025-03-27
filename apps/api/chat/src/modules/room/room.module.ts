import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { commandHandlers } from './application/commands'
import { InjectionToken } from './application/injection-token'

import { RoomEntity } from './infrastructure/entities/room.entity'
import { RoomMapper } from './infrastructure/mappers/room.mapper'
import { RoomRepository } from './infrastructure/repositories/room.repository'

@Module({
  imports: [TypeOrmModule.forFeature([RoomEntity])],
  providers: [
    {
      provide: InjectionToken.CHAT_ROOM_REPOSITORY,
      useClass: RoomRepository,
    },
    {
      provide: InjectionToken.CHAT_ROOM_MAPPER,
      useClass: RoomMapper,
    },
    ...commandHandlers,
  ],
})
export class RoomModule {}
