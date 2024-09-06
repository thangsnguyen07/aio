import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'

import { Strategy } from 'passport-local'

import { AuthService } from '../auth.service'
import { InjectionToken } from '../injection-token'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(InjectionToken.AUTH_SERVICE) private readonly authService: AuthService) {
    super()
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password)

    return user
  }
}
