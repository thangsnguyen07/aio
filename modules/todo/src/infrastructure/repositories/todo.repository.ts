import { Todo } from '../../domain/todo.model'
import { TodoRepositoryPort } from '../../domain/todo.repository.port'
import { TodoEntity } from '../entities/todo.entity'
import { Paginated, PaginatedQueryParams, readConnection, writeConnection } from '@ddd/core'
import { Logger } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'

export class TodoRepository implements TodoRepositoryPort {
  private readonly logger: Logger = new Logger(TodoRepository.name)

  constructor(protected readonly eventEmitter: EventEmitter2) {}
  async findOneById(id: string): Promise<Todo | null> {
    const entity = await readConnection.getRepository(TodoEntity).findOneBy({ id })

    return entity ? Todo.loadFromEntity(entity) : null
  }

  async findAll(): Promise<Todo[]> {
    throw new Error('Method not implemented.')
  }

  async save(model: Todo | Todo[]): Promise<void> {
    const models = Array.isArray(model) ? model : [model]

    const entities = models.map((model) => model.getProps())

    await writeConnection.manager.getRepository(TodoEntity).save(entities)

    Promise.all(models.map((model) => model.publishEvents(this.logger, this.eventEmitter)))
  }

  delete(model: Todo): Promise<boolean> {
    throw new Error(`Method not implemented. ${model}`)
  }

  findAllPaginated(params: PaginatedQueryParams): Promise<Paginated<Todo>> {
    throw new Error(`Method not implemented. ${params}`)
  }

  transaction<T>(handler: () => Promise<T>): Promise<T> {
    throw new Error(`Method not implemented ${handler}`)
  }
}
