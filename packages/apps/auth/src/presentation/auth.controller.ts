import { Body, Controller, Logger, UseGuards } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { GrpcMethod } from '@nestjs/microservices'

import { SuccessResponseDto } from '@libs/core/shared/presentation/dtos/response.dto'
import { LoginRequest } from '@libs/proto/types/auth'

import { GenerateTokenCommand } from '../application/commands/generate-token/generate-token.command'
import { LoginCommand } from '../application/commands/login/login.command'
import { JwtAuthGuard } from '../application/guards/jwt-auth.guard'

@Controller()
export class AuthController {
  private readonly logger = new Logger(AuthController.name)
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @GrpcMethod('AuthService', 'generateToken')
  async generateToken(@Body() body) {
    this.logger.log(`Generating token: ${JSON.stringify(body)}`)

    const command = new GenerateTokenCommand(body)
    return await this.commandBus.execute(command)
  }

  @UseGuards(JwtAuthGuard)
  @GrpcMethod('AuthService', 'isTokenValid')
  async verifyToken(@Body() body) {
    this.logger.log(`Verifying token: ${JSON.stringify(body)}`)

    return new SuccessResponseDto({
      accessToken: body.token,
    })
  }

  @GrpcMethod('AuthService', 'login')
  async login(data: LoginRequest) {
    this.logger.log(`Refreshing token: ${JSON.stringify(data)}`)
    const command = new LoginCommand(data)
    return await this.commandBus.execute(command)
  }
}
