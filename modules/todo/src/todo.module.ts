import { commandHandlers } from './application/commands'
import { InjectionToken } from './application/injection-token'
import { queryHandlers } from './application/queries'
import './dotenv'
import { TodoRepository } from './infrastructure/repositories/todo.repository'
import { TodoController } from './presentation/todo.controller'
import { TypeORMDatabaseModule } from '@ddd/core'
import { Module, Provider } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { get } from 'env-var'

const infrastructure: Provider[] = [
  {
    provide: InjectionToken.TODO_REPOSITORY,
    useClass: TodoRepository,
  },
]

const application = [...queryHandlers, ...commandHandlers]

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
  controllers: [TodoController],
  providers: [...infrastructure, ...application],
})
export class TodoModule {}
