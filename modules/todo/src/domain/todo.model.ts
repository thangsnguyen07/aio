import { CreateTodoProps, TodoProps, UpdateTodoProps } from './todo.types'
import { AggregateID, AggregateRoot, BaseProps } from '@ddd/core'
import { randomUUID } from 'crypto'

export class Todo extends AggregateRoot<TodoProps> {
  protected readonly _id: AggregateID

  static create(payload: CreateTodoProps): Todo {
    const id = randomUUID()

    /* Setting a default role since we are not accepting it during creation. */
    const todo = new Todo({ id, props: payload })

    /* adding "TodoCreated" Domain Event that will be published
    eventually so an event handler somewhere may receive it and do an
    appropriate action. Multiple events can be added if needed. */
    // todo.addDomainEvent(
    //   new TodoCreatedDomainEvent({
    //     aggregateId: id,
    //     ...props,
    //   }),
    // )

    return todo
  }

  update(payload: UpdateTodoProps): Todo {
    const { title, description } = payload

    this.props.title = title
    this.props.description = description

    return this

    // todo.addDomainEvent(
    //   new TodoUpdatedDomainEvent({
    //     aggregateId: this._id,
    //     ...this.props,
    //   }),
    // )
  }

  static loadFromEntity(entity: TodoProps & BaseProps): Todo {
    const { id, createdAt, updatedAt, deletedAt, version, ...props } = entity

    return new Todo({ id, props, createdAt, updatedAt, deletedAt, version })
  }

  validate(): void {
    // entity business rules validation to protect it's invariant before saving entity to a database
  }
}
