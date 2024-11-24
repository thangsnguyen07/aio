import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common'

import { CurrentUser } from '../../decorators/current-user.decorator'
import { AuthService } from './auth.service'
import { LoginDto } from './dtos/login.dto'
import { RegisterDto } from './dtos/register.dto'
import { JwtUser } from './interfaces/jwt-user.interface'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@CurrentUser() user: JwtUser) {
    return this.authService.refresh(user)
  }

  @Get('logout')
  @HttpCode(HttpStatus.OK)
  logout(@CurrentUser() user: JwtUser) {
    return this.authService.logout(user)
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() body: LoginDto) {
    return this.authService.login(body)
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() body: RegisterDto) {
    return this.authService.register(body)
  }
}
