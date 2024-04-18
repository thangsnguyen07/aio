import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'

import { TypeORMDatabaseModule } from '@libs/core'

import { get } from 'env-var'

@Module({
  imports: [
    TypeORMDatabaseModule.register({
      type: 'postgres',
      entities: ['dist/**/*.entity.js'],
      logging: get('DB_LOGGING').default('false').asBool(),
      host: get('DB_HOST').required().asString(),
      port: get('DB_PORT').required().asIntPositive(),
      username: get('DB_USERNAME').required().asString(),
      password: get('DB_PASSWORD').required().asString(),
      database: get('DB_NAME').required().asString(),
      synchronize: get('DB_SYNCHRONIZE').required().asBool(),
    }),
    CqrsModule,
  ],
  controllers: [],
  providers: [],
})
export class TodoModule {}
