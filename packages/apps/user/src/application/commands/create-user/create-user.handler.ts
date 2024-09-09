import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { RpcException } from '@nestjs/microservices'

import { User as CreateUserResponse } from '@libs/proto/types/user'

import { status } from '@grpc/grpc-js'
import { User } from 'apps/user/src/domain/user.model'
import { UserRepositoryPort } from 'apps/user/src/domain/user.repository.port'
import * as bcrypt from 'bcrypt'

import { InjectionToken } from '../../injection-token'
import { CreateUserCommand } from './create-user.command'

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand, CreateUserResponse> {
  constructor(
    @Inject(InjectionToken.USER_REPOSITORY) private readonly repository: UserRepositoryPort,
  ) {}
  async execute(command: CreateUserCommand): Promise<CreateUserResponse> {
    const { username, password } = command

    const isUserExist = await this.repository.findOneByUsername(username)

    if (isUserExist) {
      throw new RpcException({
        code: status.ALREADY_EXISTS,
        message: 'User with this username already exists',
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = User.create({ username, password: hashedPassword })
    await this.repository.save(user)

    return {
      id: user.id,
      username: user.getProps().username,
      email: user.getProps().email,
    }
  }
}
