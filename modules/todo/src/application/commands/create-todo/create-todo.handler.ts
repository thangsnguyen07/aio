import { InjectionToken } from '../../injection-token'
import { CreateTodoCommand } from './create-todo.command'
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Todo } from 'src/domain/todo.model'
import { TodoRepositoryPort } from 'src/domain/todo.repository.port'

@CommandHandler(CreateTodoCommand)
export class CreateTodoHandler implements ICommandHandler<CreateTodoCommand> {
  constructor(
    @Inject(InjectionToken.TODO_REPOSITORY)
    private readonly repository: TodoRepositoryPort,
  ) {}
  async execute(command: CreateTodoCommand): Promise<void> {
    const { userId, title, description } = command

    const todo = Todo.create({ userId, title, description })

    await this.repository.save(todo)
  }
}
