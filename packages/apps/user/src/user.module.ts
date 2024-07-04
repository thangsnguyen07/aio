import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { CqrsModule } from '@nestjs/cqrs'

import { TypeORMDatabaseModule } from '@libs/core'

import { get } from 'env-var'
import * as path from 'path'

import { UserEntity } from './infrastructure/entities/user.entity'
import { UserController } from './presentation/user.controller'
import { UserService } from './user.service'

@Module({
  imports: [
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
  providers: [UserService],
})
export class UserModule {}
