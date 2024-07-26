import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { RpcException } from '@nestjs/microservices'

import {
  ErrorResponseDto,
  SuccessResponseDto,
} from '@libs/core/shared/presentation/dtos/response.dto'

import { status } from '@grpc/grpc-js'
import { UserRepositoryPort } from 'apps/user/src/domain/user.repository.port'

import { InjectionToken } from '../../injection-token'
import { ValidateUserCommand } from './validate-user.command'

@CommandHandler(ValidateUserCommand)
export class ValidateUserHandler implements ICommandHandler<ValidateUserCommand> {
  constructor(
    @Inject(InjectionToken.USER_REPOSITORY) private readonly repository: UserRepositoryPort,
  ) {}

  async execute(command: ValidateUserCommand): Promise<any> {
    const { email, password } = command

    const user = await this.repository.findOneByEmail(email)

    if (!user) {
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: 'Email or password is incorrect',
      })
    }

    const isMatch = await user.comparePassword(password)

    if (!isMatch) {
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: 'Email or password is incorrect',
      })
    }

    return new SuccessResponseDto({ id: user.id, email: user.getProps().email })
  }
}
