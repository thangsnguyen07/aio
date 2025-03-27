import { Global, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { CqrsModule } from '@nestjs/cqrs'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CoreModule, GrpcLoggingInterceptor } from 'core'

import { ChatController } from './presentation/chat.controller'

import { dataSourceOptions } from './configs/typeorm.config'
import { ChatModule } from './modules/chat/chat.module'
import { RoomModule } from './modules/room/room.module'

@Global()
@Module({
  imports: [
    CoreModule,
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    CqrsModule,
    TypeOrmModule.forRoot(dataSourceOptions),
    ChatModule,
    RoomModule,
  ],
  controllers: [ChatController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: GrpcLoggingInterceptor,
    },
  ],
})
export class AppModule {}
