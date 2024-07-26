import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common'

import { AuthService } from './auth.service'
import { CreateUserRequestDTO } from './dtos/create-user-request.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() body: CreateUserRequestDTO) {
    return this.authService.login(body)
  }
}
