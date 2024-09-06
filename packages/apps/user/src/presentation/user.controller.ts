import { Body, Controller, Logger, Param } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { GrpcMethod } from '@nestjs/microservices'

import {
  CreateUserRequest,
  UpdateUserPasswordRequest,
  UserServiceControllerMethods,
  ValidateUserRequest,
} from '@libs/proto'

import { Metadata, ServerUnaryCall } from '@grpc/grpc-js'

import { CreateUserCommand } from '../application/commands/create-user/create-user.command'
import { UpdateUserPasswordCommand } from '../application/commands/update-password/update-password.command'
import { ValidateUserCommand } from '../application/commands/validate-user/validate-user.command'
import { FindUserByIdQuery } from '../application/queries/find-user-by-id/find-user-by-id.query'
import { routesV1 } from '../configs/app.routes'
import { FindUserByIdRequestDto } from './dtos/find-user-by-id/find-user-by-id.request.dto'

@Controller(routesV1.version)
@UserServiceControllerMethods()
export class UserController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @GrpcMethod('UserService', 'findOneUser')
  async findOneUser(@Body() body: FindUserByIdRequestDto) {
    const query = new FindUserByIdQuery(body)

    return await this.queryBus.execute(query)
  }

  async updateUser(@Param() param: FindUserByIdRequestDto) {}

  async listUsers(@Param() param: FindUserByIdRequestDto) {}

  async getUser(@Param() param: FindUserByIdRequestDto) {}

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
