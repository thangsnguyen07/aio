import { IQuery } from '@nestjs/cqrs'

export class FindTodoByIdQuery implements IQuery {
  readonly id: string

  constructor(props: FindTodoByIdQuery) {
    this.id = props.id
  }
}
