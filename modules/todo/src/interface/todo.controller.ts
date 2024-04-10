import { CreateTodoCommand } from '../application/commands/create-todo/create-todo.command'
import { FindTodoByIdQuery } from '../application/queries/find-todo-by-id/find-todo-by-id.query'
import { CreateTodoRequestDTO } from './dtos/create-todo/create-todo.request.dto'
import { FindTodoByIdRequestDTO } from './dtos/find-todo-by-id/find-todo-by-id.request.dto'
import { FindTodoByIdResponseDTO } from './dtos/find-todo-by-id/find-todo-by-id.response.dto'
import { NotFoundException } from '@ddd/core'
import { Body, NotFoundException as NotFoundHttpException, Post } from '@nestjs/common'
import { Controller, Get, Param } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { routesV1 } from 'src/configs/app.routes'

@Controller(routesV1.version)
export class TodoController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get(routesV1.todo.findById)
  async findTodoById(@Param() param: FindTodoByIdRequestDTO): Promise<FindTodoByIdResponseDTO> {
    const query = new FindTodoByIdQuery(param)

    const result: FindTodoByIdResponseDTO | NotFoundException | null =
      await this.queryBus.execute(query)

    if (result instanceof NotFoundException) {
      throw new NotFoundHttpException(result.message)
    }

    return result
  }

  @Post(routesV1.todo.root)
  async createTodo(@Body() body: CreateTodoRequestDTO): Promise<void> {
    const command = new CreateTodoCommand(body)

    await this.commandBus.execute(command)
  }
}
