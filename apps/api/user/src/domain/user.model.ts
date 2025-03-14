import { AggregateID, AggregateRoot } from 'core'
import { randomUUID } from 'crypto'

import { UserProps } from './user.type'
import { Password } from './value-objects/password.vo'

export class User extends AggregateRoot<UserProps> {
  protected readonly _id: AggregateID

  static create(payload: UserProps): User {
    const id = randomUUID()

    const user = new User({ id, props: payload })

    return user
  }

  async updatePassword(password: Password): Promise<void> {
    this.props.password = password
  }

  validate(): void {
    // entity business rules validation to protect it's invariant before saving entity to a database
  }
}
