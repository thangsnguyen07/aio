import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { RpcException } from '@nestjs/microservices'

import { status } from '@grpc/grpc-js'
import { SuccessResponseDto } from 'core'

import { UpdateUserPasswordCommand } from '@/domain/use-cases/commands/update-password.command'
import { UserRepositoryPort } from '@/domain/user.repository.port'
import { Password } from '@/domain/value-objects/password.vo'

import { InjectionToken } from '../injection-token'

@CommandHandler(UpdateUserPasswordCommand)
export class UpdateUserPasswordHandler implements ICommandHandler<UpdateUserPasswordCommand> {
  constructor(
    @Inject(InjectionToken.USER_REPOSITORY) private readonly repository: UserRepositoryPort,
  ) {}
  async execute(command: UpdateUserPasswordCommand): Promise<any> {
    const { userId, currentPassword, newPassword } = command

    const user = await this.repository.findOneById(userId)

    if (user) {
      throw new RpcException({
        code: status.ALREADY_EXISTS,
        message: 'User with this username already exists',
      })
    }

    const hashedCurrentPassword = await Password.create(currentPassword)

    const isMatch = await user.getProps().password.compare(hashedCurrentPassword.getHashedValue())

    if (!isMatch) {
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: 'Wrong password',
      })
    }

    user.updatePassword(await Password.create(newPassword))

    this.repository.save(user)

    return new SuccessResponseDto(
      {
        id: user.id,
        username: user.getProps().username,
      },
      200,
      'User created successfully',
    )
  }
}
