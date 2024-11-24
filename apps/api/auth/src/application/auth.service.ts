import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { ClientGrpc } from '@nestjs/microservices'

import { Token, USER_SERVICE_NAME } from 'proto'

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_SERVICE_NAME) private readonly client: ClientGrpc,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async generateToken(userId: string): Promise<Token> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId },
        {
          secret: this.configService.get('JWT_ACCESS_SECRET'),
          expiresIn: '1d',
        },
      ),
      this.jwtService.signAsync(
        { sub: userId },
        {
          secret: this.configService.get('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ])

    return {
      accessToken,
      refreshToken,
    }
  }
}
