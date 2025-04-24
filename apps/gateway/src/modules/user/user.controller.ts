import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common'

import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { AccessTokenGuard } from '../auth/guards/access-token.guard'
import { JwtUser } from '../auth/interfaces/jwt-user.interface'
import { UpdatePasswordDto } from './dtos/update-password.dto copy'
import { UpdateUserDto } from './dtos/update-user.dto'
import { UserService } from './user.service'

@UseGuards(AccessTokenGuard)
@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name)

  constructor(private readonly userService: UserService) {}

  @UseGuards(AccessTokenGuard)
  @Get('/me')
  @HttpCode(HttpStatus.OK)
  me(@CurrentUser() user: JwtUser) {
    this.logger.debug(`Get user: ${user.userId}`)
    return this.userService.getUser(user)
  }

  @UseGuards(AccessTokenGuard)
  @Put()
  @HttpCode(HttpStatus.OK)
  update(@CurrentUser() user: JwtUser, @Body() body: UpdateUserDto) {
    this.logger.debug(`Update user: ${user.userId}`)
    return this.userService.updateUser(user, body)
  }

  @UseGuards(AccessTokenGuard)
  @Post('/update-password')
  @HttpCode(HttpStatus.OK)
  updatePassword(@CurrentUser() user: JwtUser, @Body() body: UpdatePasswordDto) {
    this.logger.debug(`Update password: ${user.userId}`)
    return this.userService.updatePassword(user, body)
  }
}
