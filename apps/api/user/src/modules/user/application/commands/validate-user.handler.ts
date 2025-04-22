import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { RpcException } from '@nestjs/microservices'

import { ValidateUserCommand } from '@/modules/user/domain/use-cases/commands/validate-user.command'
import { UserRepositoryPort } from '@/modules/user/domain/user.repository.port'
import { status } from '@grpc/grpc-js'

import { InjectionToken } from '../injection-token'

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

    const isMatch = await user.getProps().password.compare(password)

    if (!isMatch) {
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: 'Email or password is incorrect',
      })
    }

    return { id: user.id }
  }
}
