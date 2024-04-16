import { CreateTodoRequestDTO } from './dtos/create-todo-request.dto'
import { FindTodoByIdRequestDto } from './dtos/find-todo-by-id-request.dto'
import { CreateTodoEvent } from './events/create-todo.event'
import { FindTodoByIdEvent } from './events/find-todo-by-id.event'
import { Inject, Injectable } from '@nestjs/common'
import { ClientKafka } from '@nestjs/microservices'
import { randomUUID } from 'crypto'
import { lastValueFrom } from 'rxjs'

class EventPayload<T> {
  public readonly requestId = randomUUID()
  public readonly data: T

  constructor(data: T) {
    this.data = data
  }

  toString() {
    return JSON.stringify({
      requestId: this.requestId,
      data: this.data,
    })
  }
}

@Injectable()
export class TodoService {
  constructor(@Inject('TODO_SERVICE') private readonly todoClient: ClientKafka) {}

  async createTodo(payload: CreateTodoRequestDTO) {
    this.todoClient.emit(CreateTodoEvent.EVENT_NAME, new EventPayload<CreateTodoEvent>(payload))
  }

  async findTodoById(payload: FindTodoByIdRequestDto) {
    const response = this.todoClient.send(
      FindTodoByIdEvent.EVENT_NAME,
      new EventPayload<FindTodoByIdEvent>(payload),
    )

    return lastValueFrom(response)
  }
}
