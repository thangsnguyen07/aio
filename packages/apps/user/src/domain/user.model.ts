import { AggregateID, AggregateRoot } from '@libs/core'

import * as bcrypt from 'bcrypt'
import { randomUUID } from 'crypto'

import { UserEntity } from '../infrastructure/entities/user.entity'
import { UserProps } from './user.type'

export class User extends AggregateRoot<UserProps> {
  protected readonly _id: AggregateID

  static create(payload: UserProps): User {
    const id = randomUUID()

    const user = new User({ id, props: payload })

    return user
  }

  static loadFromEntity(entity: UserEntity): User {
    const { id, createdAt, updatedAt, deletedAt, version, ...props } = entity

    return new User({ id, props, createdAt, updatedAt, deletedAt, version })
  }

  /**
   * Compare a given password with the stored password hash.
   *
   * @param {string} password - The password to compare.
   * @return {Promise<boolean>} A promise that resolves to true if the passwords match, false otherwise.
   */
  async comparePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.props.password)
  }

  async updatePassword(password: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(password, 10)
    this.props.password = hashedPassword
  }

  validate(): void {
    // entity business rules validation to protect it's invariant before saving entity to a database
  }
}
