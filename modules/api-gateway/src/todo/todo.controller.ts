import { CreateTodoRequestDTO } from './dtos/create-todo-request.dto'
import { FindTodoByIdRequestDto } from './dtos/find-todo-by-id-request.dto'
import { FindTodoByIdEvent } from './events/find-todo-by-id.event'
import { TodoService } from './todo.service'
import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common'
import { ClientKafka } from '@nestjs/microservices'

@Controller('todos')
export class TodoController {
  constructor(
    private readonly todoService: TodoService,
    @Inject('TODO_SERVICE') private readonly todoClient: ClientKafka,
  ) {}

  @Post()
  async createTodo(@Body() body: CreateTodoRequestDTO) {
    await this.todoService.createTodo(body)
  }

  @Get(':id')
  async findTodoById(@Param() params: FindTodoByIdRequestDto) {
    return await this.todoService.findTodoById(params)
  }

  onModuleInit() {
    this.todoClient.subscribeToResponseOf(FindTodoByIdEvent.EVENT_NAME)
  }
}
