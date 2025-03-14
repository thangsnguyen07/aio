import { Mapper } from 'core'
import { User as UserDto } from 'proto'

import { User } from '@/domain/user.model'
import { Email } from '@/domain/value-objects/email.vo'
import { Password } from '@/domain/value-objects/password.vo'

import { UserEntity } from '../entities/user.entity'

export class UserMapper implements Mapper<User, UserEntity, UserDto> {
  toPersistence(model: User): UserEntity {
    const { id, createdAt, updatedAt, deletedAt } = model

    return {
      id,
      email: model.getProps().email?.value,
      username: model.getProps().username,
      password: model.getProps().password.getHashedValue(),
      createdAt,
      updatedAt,
      deletedAt,
      isActive: model.getProps().isActive,
      isVerified: model.getProps().isVerified,
    }
  }
  toDomain(entity: UserEntity): User {
    const { id, createdAt, updatedAt, deletedAt, ...rest } = entity

    const props = {
      ...rest,
      email: rest.email ? new Email(rest.email) : null,
      password: Password.createFromHash(rest.password),
    }

    return new User({ id, props, createdAt, updatedAt, deletedAt })
  }
  toResponse(model: User): UserDto {
    return {
      id: model.id,
      username: model.getProps().username,
      email: model.getProps().email?.value,
      isActive: model.getProps().isActive,
      isVerified: model.getProps().isVerified,
    }
  }
}
