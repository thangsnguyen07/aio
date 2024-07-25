import { Body, Controller, Get, Param, Post } from '@nestjs/common'

import { CreateUserRequestDTO } from './dtos/create-user-request.dto'
import { FindUserByIdRequestDto } from './dtos/find-user-by-id-request.dto'
import { UserService } from './user.service'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  findUserById(@Param() param: FindUserByIdRequestDto) {
    return this.userService.findUserById(param)
  }

  @Post()
  createUser(@Body() body: CreateUserRequestDTO) {
    return this.userService.createUser(body)
  }
}
