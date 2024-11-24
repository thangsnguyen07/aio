import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { RpcException } from '@nestjs/microservices'

import { status } from '@grpc/grpc-js'
import { ResponseDto } from 'proto'

import { UserTokenRepositoryPort } from '@/domain/user-token.repository.port'

import { InjectionToken } from '@/application/injection-token'

import { LogoutCommand } from './logout.command'

@CommandHandler(LogoutCommand)
export class LogoutCommandHandler implements ICommandHandler<LogoutCommand, ResponseDto> {
  constructor(
    @Inject(InjectionToken.USER_TOKEN_REPOSITORY)
    private readonly userTokenRepository: UserTokenRepositoryPort,
  ) {}

  async execute(command: LogoutCommand): Promise<ResponseDto> {
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
        success: true,
      }
    } catch (error) {
      throw error
    }
  }
}
