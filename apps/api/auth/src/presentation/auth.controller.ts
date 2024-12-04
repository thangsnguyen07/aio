import { Controller, Logger } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { GrpcMethod } from '@nestjs/microservices'

import {
  AuthServiceControllerMethods,
  GenerateAccessTokenRequest,
  GenerateAccessTokenResponse,
  LoginRequest,
  LogoutRequest,
  RegisterRequest,
  ResponseDto,
  Token,
} from 'proto'

import { LogoutCommand } from '@/application/commands/logout/logout.command'
import { RegisterCommand } from '@/application/commands/register/register.command'

import { GenerateAccessTokenCommand } from '../application/commands/generate-access-token/generate-access-token.command'
import { LoginCommand } from '../application/commands/login/login.command'

@AuthServiceControllerMethods()
@Controller()
export class AuthController {
  private readonly logger = new Logger(AuthController.name)
  constructor(private readonly commandBus: CommandBus) {}

  @GrpcMethod('AuthService', 'generateAccessToken')
  async generateAccessToken(
    data: GenerateAccessTokenRequest,
  ): Promise<GenerateAccessTokenResponse> {
    this.logger.log(`Generating token: ${JSON.stringify(data)}`)

    const command = new GenerateAccessTokenCommand(data)
    return await this.commandBus.execute<GenerateAccessTokenCommand, GenerateAccessTokenResponse>(
      command,
    )
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

  @GrpcMethod('AuthService', 'logout')
  async logout(data: LogoutRequest): Promise<ResponseDto> {
    this.logger.log(`Logging out user: ${JSON.stringify(data)}`)

    const command = new LogoutCommand(data)
    return await this.commandBus.execute<LogoutCommand, ResponseDto>(command)
  }
}
