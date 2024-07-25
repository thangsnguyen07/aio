import { Module, Provider } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { CqrsModule } from '@nestjs/cqrs'

import { CoreModule, RequestContextService, TypeORMDatabaseModule } from '@libs/core'

import { get } from 'env-var'
import * as path from 'path'

import { commandHandlers } from './application/commands'
import { InjectionToken } from './application/injection-token'
import { queryHandlers } from './application/queries'

import { UserEntity } from './infrastructure/entities/user.entity'
import { UserRepository } from './infrastructure/repositories/user.repository'

import { UserController } from './presentation/user.controller'

const providers: Provider[] = [
  {
    provide: APP_INTERCEPTOR,
    useClass: RequestContextService,
  },
  {
    provide: InjectionToken.USER_REPOSITORY,
    useClass: UserRepository,
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
    TypeORMDatabaseModule.register({
      type: 'postgres',
      entities: [UserEntity],
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
