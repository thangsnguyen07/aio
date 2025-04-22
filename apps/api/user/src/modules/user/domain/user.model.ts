import { AggregateID, AggregateRoot, ArgumentInvalidException } from 'core'
import { randomUUID } from 'crypto'

import { UserCreatedDomainEvent } from './use-cases/events/user-created.event'
import { UserProps } from './user.type'
import { Password } from './value-objects/password.vo'

export class User extends AggregateRoot<UserProps> {
  protected readonly _id: AggregateID

  static create(payload: UserProps): User {
    const id = randomUUID()

    const user = new User({ id, props: payload })

    user.addDomainEvent(
      new UserCreatedDomainEvent({
        aggregateId: id,
        userId: id,
        email: payload.email,
      }),
    )

    return user
  }

  async updatePassword(password: Password): Promise<void> {
    this.props.password = password
  }

  validate(): void {
    // if (!this.props.username) {
    //   throw new ArgumentInvalidException('Username is required')
    // }

    if (!this.props.password) {
      throw new ArgumentInvalidException('Password is required')
    }
  }
}
