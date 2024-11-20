import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { RpcException } from '@nestjs/microservices'

import { status } from '@grpc/grpc-js'
import { Token } from 'proto'

import { UserTokenRepositoryPort } from '@/domain/user-token.repository.port'

import { AuthService } from '@/application/auth.service'
import { InjectionToken } from '@/application/injection-token'

import { GenerateAccessTokenCommand } from './generate-access-token.command'

@CommandHandler(GenerateAccessTokenCommand)
export class GenerateTokenHandler implements ICommandHandler<GenerateAccessTokenCommand> {
  constructor(
    @Inject(InjectionToken.USER_TOKEN_REPOSITORY)
    private readonly repository: UserTokenRepositoryPort,
    @Inject(InjectionToken.AUTH_SERVICE)
    private readonly authService: AuthService,
  ) {}

  async execute(command: GenerateAccessTokenCommand): Promise<Token> {
    try {
      const { refreshToken } = command

      const userToken = await this.repository.findOneByRefreshToken(refreshToken)

      if (!userToken) {
        throw new RpcException({
          code: status.INVALID_ARGUMENT,
          message: 'Invalid token',
        })
      }

      const token = await this.authService.generateToken(userToken.getProps().userId)

      return {
        accessToken: token.accessToken,
        refreshToken,
      }
    } catch (error) {
      throw error
    }
  }
}
