import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { RpcException } from '@nestjs/microservices'

import { status } from '@grpc/grpc-js'
import { GenerateAccessTokenResponse } from 'proto'

import { GenerateAccessTokenCommand } from '../../domain/use-cases/commands/generate-access-token.command'
import { UserTokenRepositoryPort } from '../../domain/user-token.repository.port'
import { AuthService } from '../auth.service'
import { InjectionToken } from '../injection-token'

@CommandHandler(GenerateAccessTokenCommand)
export class GenerateAccessTokenHandler implements ICommandHandler<GenerateAccessTokenCommand> {
  constructor(
    @Inject(InjectionToken.USER_TOKEN_REPOSITORY)
    private readonly userTokenRepository: UserTokenRepositoryPort,
    @Inject(InjectionToken.AUTH_SERVICE)
    private readonly authService: AuthService,
  ) {}

  async execute(command: GenerateAccessTokenCommand): Promise<GenerateAccessTokenResponse> {
    try {
      const { userId } = command

      const userToken = await this.userTokenRepository.findOneByUserId(userId)

      if (!userToken) {
        throw new RpcException({
          code: status.INVALID_ARGUMENT,
          message: 'User does not exists',
        })
      }

      const accessToken = await this.authService.generateAccessToken(userToken.getProps().userId)

      return {
        accessToken,
      }
    } catch (error) {
      throw error
    }
  }
}
