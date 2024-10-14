import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'

import { ExtractJwt, Strategy } from 'passport-jwt'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('token'),
      secretOrKey: configService.get('JWT_SECRET'),
    })
  }

  async validate(payload: any): Promise<any> {
    if (!payload) {
      throw new UnauthorizedException('Invalid token payload')
    }

    console.log('JWT payload:', payload)

    // Ensure the payload contains the necessary information
    if (!payload.sub || !payload.email) {
      throw new UnauthorizedException('Token missing necessary fields')
    }

    return { userId: payload.sub, email: payload.email }
  }
}
