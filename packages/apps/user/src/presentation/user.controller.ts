import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { NotFoundException as NotFoundHttpException } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { GrpcMethod } from '@nestjs/microservices'

import { NotFoundException } from '@libs/core'
import { UserServiceControllerMethods } from '@libs/proto'

import { CreateUserCommand } from '../application/commands/create-user/create-user.command'
import { ValidateUserCommand } from '../application/commands/validate-user/validate-user.command'
import { FindUserByIdQuery } from '../application/queries/find-user-by-id/find-user-by-id.query'
import { routesV1 } from '../configs/app.routes'
import { CreateUserRequestDto } from './dtos/create-user/create-user.request.dto'
import { FindUserByIdRequestDto } from './dtos/find-user-by-id/find-user-by-id.request.dto'
import { ValidateUserRequestDto } from './dtos/validate-user/validate-user.request.dto'

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

  async queryUsers(@Param() param: FindUserByIdRequestDto) {}

  @GrpcMethod('UserService', 'createUser')
  async createUser(@Body() body: CreateUserRequestDto) {
    const command = new CreateUserCommand(body)
    return await this.commandBus.execute(command)
  }

  @GrpcMethod('UserService', 'validateUser')
  async validateUser(@Body() body: ValidateUserRequestDto) {
    const command = new ValidateUserCommand(body)
    return await this.commandBus.execute(command)
  }
}
