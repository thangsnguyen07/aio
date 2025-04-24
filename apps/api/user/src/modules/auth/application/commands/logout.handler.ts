import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { RpcException } from '@nestjs/microservices'

import { status } from '@grpc/grpc-js'
import { LogoutResponse } from 'proto'

import { LogoutCommand } from '../../domain/use-cases/commands/logout.command'
import { UserTokenRepositoryPort } from '../../domain/user-token.repository.port'
import { InjectionToken } from '../injection-token'

@CommandHandler(LogoutCommand)
export class LogoutCommandHandler implements ICommandHandler<LogoutCommand, LogoutResponse> {
  constructor(
    @Inject(InjectionToken.USER_TOKEN_REPOSITORY)
    private readonly userTokenRepository: UserTokenRepositoryPort,
  ) {}

  async execute(command: LogoutCommand): Promise<LogoutResponse> {
    try {
      const { userId } = command

      const userToken = await this.userTokenRepository.findOneByUserId(userId)

      if (!userToken) {
        throw new RpcException({
          code: status.INVALID_ARGUMENT,
          message: 'User does not exists',
        })
      }

      userToken.update({ refreshToken: null })

      this.userTokenRepository.save(userToken)

      return {
        message: '',
      }
    } catch (error) {
      throw error
    }
  }
}
