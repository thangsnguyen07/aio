import { Controller, Get, HttpCode, HttpStatus, Logger, UseGuards } from '@nestjs/common'

import { CurrentUser } from '../../decorators/current-user.decorator'
import { AccessTokenGuard } from '../auth/guards/access-token.guard'
import { JwtUser } from '../auth/interfaces/jwt-user.interface'
import { UserService } from './user.service'

@UseGuards(AccessTokenGuard)
@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name)

  constructor(private readonly userService: UserService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getUser(@CurrentUser() user: JwtUser) {
    this.logger.debug('Get user: ', user)

    return this.userService.getUser(user)
  }
}
