import { AggregateID, AggregateRoot } from 'core'
import { randomUUID } from 'crypto'

import { UserTokenProps } from './user-token.type'

export class UserToken extends AggregateRoot<UserTokenProps> {
  protected readonly _id: AggregateID

  static create(payload: UserTokenProps): UserToken {
    const id = randomUUID()

    const user = new UserToken({ id, props: payload })

    return user
  }

  update(payload: Partial<UserTokenProps>): void {
    if (payload.refreshToken) {
      this.props.refreshToken = payload.refreshToken
    }

    if (payload.revokedAt) {
      this.props.revokedAt = payload.revokedAt
    }
  }

  validate(): void {
    // entity business rules validation to protect it's invariant before saving entity to a database
  }
}
