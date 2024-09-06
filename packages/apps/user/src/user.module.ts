import { Module, Provider } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { CqrsModule } from '@nestjs/cqrs'
import { ClientsModule, Transport } from '@nestjs/microservices'

import { CoreModule, RequestContextService, TypeORMDatabaseModule } from '@libs/core'
import { GrpcLoggingInterceptor } from '@libs/core/application/interceptors/grpc-logging.interceptor'
import { AUTH_PACKAGE_NAME, AUTH_SERVICE_NAME } from '@libs/proto/types/auth'

import { get } from 'env-var'
import * as path from 'path'

import { commandHandlers } from './application/commands'
import { InjectionToken } from './application/injection-token'
import { queryHandlers } from './application/queries'

import { UserTokenEntity } from './infrastructure/entities/user-token.entity'
import { UserEntity } from './infrastructure/entities/user.entity'
import { UserTokenRepository } from './infrastructure/repositories/user-token.repository'
import { UserRepository } from './infrastructure/repositories/user.repository'

import { UserController } from './presentation/user.controller'

const providers: Provider[] = [
  {
    provide: APP_INTERCEPTOR,
    useClass: RequestContextService,
  },
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
      envFilePath: [path.resolve(__dirname, `../.env.${process.env.NODE_ENV}`), '.env'],
      isGlobal: true,
    }),
    CqrsModule,
    ClientsModule.register([
      {
        name: AUTH_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          package: AUTH_PACKAGE_NAME,
          protoPath: path.join(__dirname, '../proto/auth.proto'),
          url: '0.0.0.0:5001',
        },
      },
    ]),
    TypeORMDatabaseModule.register({
      type: 'postgres',
      entities: [UserEntity, UserTokenEntity],
      logging: get('DB_LOGGING').default('false').asBool(),
      host: get('DB_HOST').required().asString(),
      port: get('DB_PORT').required().asIntPositive(),
      username: get('DB_USERNAME').required().asString(),
      password: get('DB_PASSWORD').required().asString(),
      database: get('DB_NAME').required().asString(),
      synchronize: get('DB_SYNCHRONIZE').required().asBool(),
      schema: 'user',
    }),
  ],
  controllers: [UserController],
  providers: [...providers, ...application],
})
export class UserModule {}
