import { Controller, Get, HttpCode, HttpStatus, Logger, Param, Post } from '@nestjs/common'

import { GetUserByIdRequestDto } from './dtos/get-user-by-id-request.dto'
import { UserService } from './user.service'

@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name)

  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getUserById(@Param() param: GetUserByIdRequestDto) {
    return this.userService.getUserById(param)
  }
}
