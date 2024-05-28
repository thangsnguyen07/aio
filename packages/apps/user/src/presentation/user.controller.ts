import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { NotFoundException as NotFoundHttpException } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'

import { NotFoundException } from '@libs/core'

import { CreateUserCommand } from '../application/handlers/create-user/create-user.command'
import { FindUserByIdQuery } from '../application/queries/find-user-by-id/find-user-by-id.query'
import { routesV1 } from '../configs/app.routes'
import { CreateUserRequestDto } from './dtos/create-user/create-user.request.dto'
import { FindUserByIdRequestDto } from './dtos/find-user-by-id/find-user-by-id.request.dto'

@Controller(routesV1.version)
export class UserController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get(routesV1.user.findById)
  async findUserById(@Param() param: FindUserByIdRequestDto) {
    const query = new FindUserByIdQuery(param)

    const result = await this.queryBus.execute(query)

    if (result instanceof NotFoundException) {
      throw new NotFoundHttpException(result.message)
    }

    return result
  }

  @Post(routesV1.user.create)
  async createUser(@Body() body: CreateUserRequestDto) {
    const command = new CreateUserCommand(body)

    await this.commandBus.execute(command)
  }
}
