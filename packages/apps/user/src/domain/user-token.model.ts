import { AggregateID, AggregateRoot } from '@libs/core'

import { randomUUID } from 'crypto'

import { UserTokenEntity } from '../infrastructure/entities/user-token.entity'
import { UserTokenProps } from './user-token.type'

export class UserToken extends AggregateRoot<UserTokenProps> {
  protected readonly _id: AggregateID

  static create(payload: UserTokenProps): UserToken {
    const id = randomUUID()

    const userToken = new UserToken({ id, props: payload })

    return userToken
  }

  static loadFromEntity(entity: UserTokenEntity): UserToken {
    const { id, createdAt, updatedAt, deletedAt, version, ...props } = entity

    return new UserToken({ id, props, createdAt, updatedAt, deletedAt, version })
  }

  validate(): void {
    // entity business rules validation to protect it's invariant before saving entity to a database
  }
}
