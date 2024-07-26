import { Body, Controller, Get } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { GrpcMethod } from '@nestjs/microservices'

import { UserLoginCommand } from '../application/commands/user-login/user-login.command'

@Controller()
export class AuthController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @GrpcMethod('AuthService', 'login')
  async login(@Body() body) {
    const command = new UserLoginCommand(body)
    return await this.commandBus.execute(command)
  }
}
