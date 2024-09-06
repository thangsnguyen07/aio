import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { ClientGrpc, RpcException } from '@nestjs/microservices'

import { SuccessResponseDto } from '@libs/core/shared/presentation/dtos/response.dto'
import { AUTH_SERVICE_NAME, AuthServiceClient } from '@libs/proto/types/auth'

import { status } from '@grpc/grpc-js'
import { UserRepositoryPort } from 'apps/user/src/domain/user.repository.port'
import * as bcrypt from 'bcrypt'

import { InjectionToken } from '../../injection-token'
import { UpdateUserPasswordCommand } from './update-password.command'

@CommandHandler(UpdateUserPasswordCommand)
export class UpdateUserPasswordHandler implements ICommandHandler<UpdateUserPasswordCommand> {
  constructor(
    @Inject(AUTH_SERVICE_NAME) private readonly client: ClientGrpc,

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

    const hashedCurrentPassword = await bcrypt.hash(currentPassword, 10)

    const isMatch = await user.comparePassword(hashedCurrentPassword)

    if (!isMatch) {
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: 'Wrong password',
      })
    }

    user.updatePassword(newPassword)

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
