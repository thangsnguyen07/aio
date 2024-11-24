import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common'

import { CurrentUser } from '../../decorators/current-user.decorator'
import { JwtUser } from '../auth/interfaces/jwt-user.interface'
import { UserService } from './user.service'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getUser(@CurrentUser() user: JwtUser) {
    return this.userService.getUser(user)
  }
}
