import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { ConflictException } from 'core'
import { User as CreateUserResponse } from 'proto'

import { CreateUserCommand } from '@/domain/use-cases/commands/create-user.command'
import { User } from '@/domain/user.model'
import { UserRepositoryPort } from '@/domain/user.repository.port'
import { Email } from '@/domain/value-objects/email.vo'
import { Password } from '@/domain/value-objects/password.vo'

import { UserMapper } from '@/infrastructure/mappers/user.mapper'

import { InjectionToken } from '../injection-token'

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand, CreateUserResponse> {
  constructor(
    @Inject(InjectionToken.USER_REPOSITORY) private readonly repository: UserRepositoryPort,
    @Inject(InjectionToken.USER_MAPPER) private readonly userMapper: UserMapper,
  ) {}

  async execute(command: CreateUserCommand): Promise<CreateUserResponse> {
    const { username, email, password } = command

    const user = await this.repository.findOneByUsername(username)

    if (user) {
      throw new ConflictException('User with this username already exists')
    }

    const hashedPassword = await Password.create(password)

    const newUser = User.create({
      username,
      email: new Email(email),
      password: hashedPassword,
    })
    await this.repository.save(newUser)

    return this.userMapper.toResponse(newUser)
  }
}
