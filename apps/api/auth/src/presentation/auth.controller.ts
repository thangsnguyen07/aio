import { Body, Controller, Logger, UseGuards } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { GrpcMethod } from '@nestjs/microservices'

import { GrpcGuard, SuccessResponseDto } from 'core'
import { GenerateTokenRequest, LoginRequest, RegisterRequest, Token } from 'proto'

import { RegisterCommand } from '@/application/commands/register/register.command'

import { GenerateTokenCommand } from '../application/commands/generate-token/generate-token.command'
import { LoginCommand } from '../application/commands/login/login.command'
import { JwtAuthGuard } from '../application/guards/jwt-auth.guard'

@UseGuards(GrpcGuard)
@Controller()
export class AuthController {
  private readonly logger = new Logger(AuthController.name)
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @GrpcMethod('AuthService', 'generateToken')
  async generateToken(data: GenerateTokenRequest): Promise<Token> {
    this.logger.log(`Generating token: ${JSON.stringify(data)}`)

    const command = new GenerateTokenCommand(data)
    return await this.commandBus.execute<GenerateTokenCommand, Token>(command)
  }

  @UseGuards(JwtAuthGuard)
  @GrpcMethod('AuthService', 'isTokenValid')
  async verifyToken(@Body() body): Promise<any> {
    this.logger.log(`Verifying token: ${JSON.stringify(body)}`)

    return new SuccessResponseDto({
      accessToken: body.token,
    })
  }

  @GrpcMethod('AuthService', 'login')
  async login(data: LoginRequest): Promise<Token> {
    this.logger.log(`Refreshing token: ${JSON.stringify(data)}`)

    const command = new LoginCommand(data)
    return await this.commandBus.execute<LoginCommand, Token>(command)
  }

  @GrpcMethod('AuthService', 'register')
  async register(data: RegisterRequest): Promise<Token> {
    this.logger.log(`Registering user: ${JSON.stringify(data)}`)

    const command = new RegisterCommand(data)
    return await this.commandBus.execute<RegisterCommand, Token>(command)
  }
}
