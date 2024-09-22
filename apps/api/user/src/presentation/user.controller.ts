import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { GrpcMethod } from '@nestjs/microservices'

import {
  CreateUserRequest,
  GetUserByIdRequest,
  UpdateUserPasswordRequest,
  UserServiceControllerMethods,
  ValidateUserRequest,
} from 'proto'

import { CreateUserCommand } from '../application/commands/create-user/create-user.command'
import { UpdateUserPasswordCommand } from '../application/commands/update-password/update-password.command'
import { ValidateUserCommand } from '../application/commands/validate-user/validate-user.command'
import { GetUserByIdQuery } from '../application/queries/get-user-by-id/get-user-by-id.query'

@UserServiceControllerMethods()
export class UserController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @GrpcMethod('UserService', 'getUserById')
  async getUserById(data: GetUserByIdRequest) {
    const query = new GetUserByIdQuery(data)
    return await this.queryBus.execute(query)
  }

  async updateUser() {}

  async listUsers() {}

  async getUser() {}

  @GrpcMethod('UserService', 'createUser')
  async createUser(data: CreateUserRequest) {
    const command = new CreateUserCommand(data)
    return await this.commandBus.execute(command)
  }

  @GrpcMethod('UserService', 'validateUser')
  async validateUser(data: ValidateUserRequest) {
    const command = new ValidateUserCommand(data)
    return await this.commandBus.execute(command)
  }

  @GrpcMethod('UserService', 'updateUserPassword')
  async updateUserPassword(data: UpdateUserPasswordRequest) {
    const command = new UpdateUserPasswordCommand(data)
    return await this.commandBus.execute(command)
  }
}
