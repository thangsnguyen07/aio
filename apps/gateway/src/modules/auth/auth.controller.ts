import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common'

import { Response } from 'express'
import { lastValueFrom } from 'rxjs'

import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { AuthService } from './auth.service'
import { LoginDto } from './dtos/login.dto'
import { RegisterDto } from './dtos/register.dto'
import { AccessTokenGuard } from './guards/access-token.guard'
import { RefreshTokenGuard } from './guards/refresh-token.guard'
import { JwtUser } from './interfaces/jwt-user.interface'

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name)

  constructor(private readonly authService: AuthService) {}

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@CurrentUser() user: JwtUser) {
    const observable = this.authService.refresh(user)
    const result = await lastValueFrom(observable)

    return {
      accessToken: result.accessToken,
    }
  }

  @UseGuards(AccessTokenGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@CurrentUser() user: JwtUser, @Res({ passthrough: true }) res: Response) {
    const observable = this.authService.logout(user)
    const result = await lastValueFrom(observable)

    res.clearCookie('refresh-token')

    return result
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginDto, @Res({ passthrough: true }) res: Response) {
    const observable = this.authService.login(body)
    const result = await lastValueFrom(observable)

    res.cookie('refresh-token', result.refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    return result
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: RegisterDto, @Res({ passthrough: true }) res: Response) {
    this.logger.log(`Register: ${JSON.stringify(body)}`)

    const observable = this.authService.register(body)
    const result = await lastValueFrom(observable)

    res.cookie('refresh-token', result.refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    return {
      accessToken: result.accessToken,
    }
  }
}
