import { InjectionToken } from '../../injection-token'
import { FindTodoByIdQuery } from './find-todo-by-id.query'
import { NotFoundException } from '@ddd/core'
import { Inject } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { TodoRepositoryPort } from 'src/domain/todo.repository.port'
import { FindTodoByIdResponseDTO } from 'src/interface/dtos/find-todo-by-id/find-todo-by-id.response.dto'

@QueryHandler(FindTodoByIdQuery)
export class FindTodoQueryHandler
  implements IQueryHandler<FindTodoByIdQuery, FindTodoByIdResponseDTO | NotFoundException>
{
  constructor(
    @Inject(InjectionToken.TODO_REPOSITORY)
    private readonly repository: TodoRepositoryPort,
  ) {}
  async execute(query: FindTodoByIdQuery): Promise<FindTodoByIdResponseDTO | NotFoundException> {
    const { id } = query

    const todo = await this.repository.findOneById(id)

    if (!todo) {
      return new NotFoundException()
    }

    return new FindTodoByIdResponseDTO(todo)
  }
}
