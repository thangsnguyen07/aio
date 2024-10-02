import { Module, Provider } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { CqrsModule } from '@nestjs/cqrs'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CoreModule, GrpcLoggingInterceptor } from 'core'
import { AUTH_SERVICE_NAME } from 'proto'

import { commandHandlers } from './application/commands'
import { InjectionToken } from './application/injection-token'
import { queryHandlers } from './application/queries'

import { UserTokenRepository } from './infrastructure/repositories/user-token.repository'
import { UserRepository } from './infrastructure/repositories/user.repository'

import { UserController } from './presentation/user.controller'

import { dataSourceOptions } from './configs/typeorm.config'

const providers: Provider[] = [
  {
    provide: APP_INTERCEPTOR,
    useClass: GrpcLoggingInterceptor,
  },
  {
    provide: InjectionToken.USER_REPOSITORY,
    useClass: UserRepository,
  },
  {
    provide: InjectionToken.USER_TOKEN_REPOSITORY,
    useClass: UserTokenRepository,
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
    ClientsModule.register([
      {
        name: AUTH_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          package: 'auth',
          protoPath: 'node_modules/proto/auth.proto',
          url: '0.0.0.0:5001',
        },
      },
    ]),
    TypeOrmModule.forRoot(dataSourceOptions),
  ],
  controllers: [UserController],
  providers: [...providers, ...application],
})
export class UserModule {}
