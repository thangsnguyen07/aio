import { Logger } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { GrpcMethod } from '@nestjs/microservices'

import { GenerateAccessTokenCommand } from '@/modules/auth/domain/use-cases/commands/generate-access-token.command'
import { LoginCommand } from '@/modules/auth/domain/use-cases/commands/login.command'
import { LogoutCommand } from '@/modules/auth/domain/use-cases/commands/logout.command'
import { RefreshCommand } from '@/modules/auth/domain/use-cases/commands/refresh.command'
import { RegisterCommand } from '@/modules/auth/domain/use-cases/commands/register.command'
import { CreateUserCommand } from '@/modules/user/domain/use-cases/commands/create-user.command'
import { UpdateUserPasswordCommand } from '@/modules/user/domain/use-cases/commands/update-password.command'
import { UpdateUserCommand } from '@/modules/user/domain/use-cases/commands/update-user.command'
import { GetUserByIdQuery } from '@/modules/user/domain/use-cases/queries/get-user-by-id.query'
import { Email } from '@/modules/user/domain/value-objects/email.vo'
import {
  CreateUserRequest,
  GenerateAccessTokenRequest,
  GenerateAccessTokenResponse,
  GetUserByIdRequest,
  LoginRequest,
  LogoutRequest,
  LogoutResponse,
  RefreshRequest,
  RegisterRequest,
  Token,
  UpdateUserPasswordRequest,
  UpdateUserRequest,
  UserServiceControllerMethods,
} from 'proto'
import { User } from 'proto'

@UserServiceControllerMethods()
export class UserController {
  private readonly logger = new Logger(UserController.name)

  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @GrpcMethod('UserService', 'getUserById')
  async getUserById(data: GetUserByIdRequest): Promise<User> {
    this.logger.log(`Getting user by id: ${JSON.stringify(data)}`)

    const query = new GetUserByIdQuery(data)
    return await this.queryBus.execute<GetUserByIdQuery, User>(query)
  }

  @GrpcMethod('UserService', 'updateUser')
  async updateUser(data: UpdateUserRequest): Promise<User> {
    const payload = {
      ...data,
      email: data.email ? new Email(data.email) : undefined,
    }

    const command = new UpdateUserCommand({
      userId: data.userId,
      payload,
    })

    return await this.commandBus.execute<UpdateUserCommand, User>(command)
  }

  async listUsers(): Promise<void> {}

  async getUser(): Promise<void> {}

  @GrpcMethod('UserService', 'createUser')
  async createUser(data: CreateUserRequest): Promise<User> {
    const command = new CreateUserCommand(data)
    return await this.commandBus.execute<CreateUserCommand, User>(command)
  }

  @GrpcMethod('UserService', 'refresh')
  async refresh(data: RefreshRequest): Promise<any> {
    this.logger.log(`Refreshing token: ${JSON.stringify(data)}`)
    const command = new RefreshCommand(data)
    return await this.commandBus.execute<RefreshCommand, any>(command)
  }

  @GrpcMethod('UserService', 'updateUserPassword')
  async updateUserPassword(data: UpdateUserPasswordRequest): Promise<User> {
    const command = new UpdateUserPasswordCommand(data)
    return await this.commandBus.execute<UpdateUserPasswordCommand, User>(command)
  }

  @GrpcMethod('UserService', 'generateAccessToken')
  async generateAccessToken(
    data: GenerateAccessTokenRequest,
  ): Promise<GenerateAccessTokenResponse> {
    this.logger.log(`Generating token: ${JSON.stringify(data)}`)

    const command = new GenerateAccessTokenCommand(data)
    return await this.commandBus.execute<GenerateAccessTokenCommand, GenerateAccessTokenResponse>(
      command,
    )
  }

  @GrpcMethod('UserService', 'login')
  async login(data: LoginRequest): Promise<Token> {
    this.logger.log(`Refreshing token: ${JSON.stringify(data)}`)

    const command = new LoginCommand(data)
    return await this.commandBus.execute<LoginCommand, Token>(command)
  }

  @GrpcMethod('UserService', 'register')
  async register(data: RegisterRequest): Promise<Token> {
    this.logger.log(`Registering user: ${JSON.stringify(data)}`)

    const command = new RegisterCommand(data)
    return await this.commandBus.execute<RegisterCommand, Token>(command)
  }

  @GrpcMethod('UserService', 'logout')
  async logout(data: LogoutRequest): Promise<LogoutResponse> {
    this.logger.log(`Logging out user: ${JSON.stringify(data)}`)

    const command = new LogoutCommand(data)
    return await this.commandBus.execute<LogoutCommand, LogoutResponse>(command)
  }
}
