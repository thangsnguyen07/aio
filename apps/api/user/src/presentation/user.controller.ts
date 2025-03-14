import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { GrpcMethod } from '@nestjs/microservices'

import {
  CreateUserRequest,
  GetUserByIdRequest,
  UpdateUserPasswordRequest,
  UserServiceControllerMethods,
  ValidateUserRequest,
} from 'proto'
import { User } from 'proto'

import { CreateUserCommand } from '@/domain/use-cases/commands/create-user.command'
import { UpdateUserPasswordCommand } from '@/domain/use-cases/commands/update-password.command'
import { ValidateUserCommand } from '@/domain/use-cases/commands/validate-user.command'
import { GetUserByIdQuery } from '@/domain/use-cases/queries/get-user-by-id.query'

@UserServiceControllerMethods()
export class UserController {
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

  @GrpcMethod('UserService', 'validateUser')
  async validateUser(data: ValidateUserRequest): Promise<User> {
    const command = new ValidateUserCommand(data)
    return await this.commandBus.execute<ValidateUserCommand, User>(command)
  }

  @GrpcMethod('UserService', 'updateUserPassword')
  async updateUserPassword(data: UpdateUserPasswordRequest): Promise<User> {
    const command = new UpdateUserPasswordCommand(data)
    return await this.commandBus.execute<UpdateUserPasswordCommand, User>(command)
  }
}
