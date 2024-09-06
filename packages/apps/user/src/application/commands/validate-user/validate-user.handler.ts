import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { RpcException } from '@nestjs/microservices'

import { ValidateUserResponse } from '@libs/proto/types/user'

import { status } from '@grpc/grpc-js'
import { UserRepositoryPort } from 'apps/user/src/domain/user.repository.port'

import { InjectionToken } from '../../injection-token'
import { ValidateUserCommand } from './validate-user.command'

@CommandHandler(ValidateUserCommand)
export class ValidateUserHandler
  implements ICommandHandler<ValidateUserCommand, ValidateUserResponse>
{
  constructor(
    @Inject(InjectionToken.USER_REPOSITORY) private readonly repository: UserRepositoryPort,
  ) {}

  async execute(command: ValidateUserCommand): Promise<any> {
    const { username, password } = command

    const user = await this.repository.findOneByUsername(username)

    if (!user) {
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: 'Username or password is incorrect',
      })
    }

    const isMatch = await user.comparePassword(password)

    if (!isMatch) {
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: 'Username or password is incorrect',
      })
    }

    return { id: user.id }
  }
}
