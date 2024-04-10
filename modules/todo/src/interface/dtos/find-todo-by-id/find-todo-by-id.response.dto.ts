import { BaseResponseDTO } from '@ddd/core'
import { Todo } from 'src/domain/todo.model'

export class FindTodoByIdResponseDTO extends BaseResponseDTO {
  protected userId: string
  protected title: string
  protected description: string

  constructor(props: Todo) {
    super({
      id: props.id,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
      deletedAt: props.deletedAt,
    })

    this.userId = props.getProps().userId
    this.title = props.getProps().title
    this.description = props.getProps().description
  }
}
