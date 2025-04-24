import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { REQUEST } from '@nestjs/core'
import { TerminusModule } from '@nestjs/terminus'
import { ThrottlerModule } from '@nestjs/throttler'

import { GrpcClientService } from './common/services/grpc-client.service'
import configuration from './configs/configuration'
import { AuthModule } from './modules/auth/auth.module'
import { UserModule } from './modules/user/user.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    TerminusModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}
