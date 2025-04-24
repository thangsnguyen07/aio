import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'

import { Request } from 'express'
import { JwtPayload } from 'jsonwebtoken'
import { ExtractJwt, Strategy } from 'passport-jwt'

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.['refresh-token']
        },
      ]),
      secretOrKey: configService.get<string>('jwt.refreshSecret'),
      passReqToCallback: true,
    })
  }

  async validate(_: Request, payload: JwtPayload) {
    // const refreshToken = req.cookies?.['refresh-token']
    return payload
  }
}
