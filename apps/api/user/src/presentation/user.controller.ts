import { Logger } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { GrpcMethod } from '@nestjs/microservices'

import { GenerateAccessTokenCommand } from '@/modules/auth/domain/use-cases/commands/generate-access-token.command'
import { LoginCommand } from '@/modules/auth/domain/use-cases/commands/login.command'
import { LogoutCommand } from '@/modules/auth/domain/use-cases/commands/logout.command'
import { RegisterCommand } from '@/modules/auth/domain/use-cases/commands/register.command'
import { CreateUserCommand } from '@/modules/user/domain/use-cases/commands/create-user.command'
import { UpdateUserPasswordCommand } from '@/modules/user/domain/use-cases/commands/update-password.command'
// import { ValidateUserCommand } from '@/modules/user/domain/use-cases/commands/validate-user.command'
import { GetUserByIdQuery } from '@/modules/user/domain/use-cases/queries/get-user-by-id.query'
import {
  CreateUserRequest,
  GenerateAccessTokenRequest,
  GenerateAccessTokenResponse,
  GetUserByIdRequest,
  LoginRequest,
  LogoutRequest,
  LogoutResponse,
  RegisterRequest,
  Token,
  UpdateUserPasswordRequest,
  UserServiceControllerMethods, // ValidateUserRequest,
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
    const query = new GetUserByIdQuery(data)
    return await this.queryBus.execute<GetUserByIdQuery, User>(query)
  }

  async updateUser(): Promise<void> {}

  async listUsers(): Promise<void> {}

  async getUser(): Promise<void> {}

  @GrpcMethod('UserService', 'createUser')
  async createUser(data: CreateUserRequest): Promise<User> {
    const command = new CreateUserCommand(data)
    return await this.commandBus.execute<CreateUserCommand, User>(command)
  }

  // @GrpcMethod('UserService', 'validateUser')
  // async validateUser(data: ValidateUserRequest): Promise<User> {
  //   const command = new ValidateUserCommand(data)
  //   return await this.commandBus.execute<ValidateUserCommand, User>(command)
  // }

  @GrpcMethod('UserService', 'refresh')
  async refresh(data: Token): Promise<any> {
    this.logger.log(`Refreshing token: ${JSON.stringify(data)}`)
  }

  @GrpcMethod('UserService', 'updateUserPassword')
  async updateUserPassword(data: UpdateUserPasswordRequest): Promise<User> {
    const command = new UpdateUserPasswordCommand(data)
    return await this.commandBus.execute<UpdateUserPasswordCommand, User>(command)
  }

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
  async logout(data: LogoutRequest): Promise<LogoutResponse> {
    this.logger.log(`Logging out user: ${JSON.stringify(data)}`)

    const command = new LogoutCommand(data)
    return await this.commandBus.execute<LogoutCommand, LogoutResponse>(command)
  }
}
