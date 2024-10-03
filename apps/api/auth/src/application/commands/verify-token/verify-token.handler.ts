import { ConfigService } from '@nestjs/config'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { JwtService } from '@nestjs/jwt'
import { RpcException } from '@nestjs/microservices'

import { status } from '@grpc/grpc-js'
import { SuccessResponseDto } from 'core'

import { VerifyTokenCommand } from './verify-token.command'

@CommandHandler(VerifyTokenCommand)
export class VerifyTokenHandler implements ICommandHandler<VerifyTokenCommand, any> {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async execute(command: VerifyTokenCommand): Promise<any> {
    try {
      await this.jwtService.verifyAsync(command.token, {
        secret: this.configService.get('JWT_SECRET'),
      })

      return new SuccessResponseDto({
        token: command.token,
      })
    } catch {
      throw new RpcException({
        code: status.PERMISSION_DENIED,
        message: 'Invalid token',
      })
    }
  }
}
