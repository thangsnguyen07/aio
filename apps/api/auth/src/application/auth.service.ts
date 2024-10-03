import { Inject, Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { ClientGrpc, RpcException } from '@nestjs/microservices'

import { Token, USER_SERVICE_NAME, UserServiceClient } from 'proto'
import { catchError, lastValueFrom, throwError } from 'rxjs'

@Injectable()
export class AuthService {
  private userClient: UserServiceClient

  constructor(
    @Inject(USER_SERVICE_NAME) private readonly client: ClientGrpc,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    try {
      const req = this.userClient
        .validateUser({ username, password })
        .pipe(catchError((error) => throwError(() => new RpcException(error))))

      const result = await lastValueFrom(req)

      return result
    } catch (error) {
      Logger.log(error)
      throw error
    }
  }

  async generateToken(userId: string, username: string): Promise<Token> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, username },
        {
          secret: this.configService.get('JWT_ACCESS_SECRET'),
          expiresIn: '1d',
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, username },
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

  onModuleInit(): void {
    this.userClient = this.client.getService<UserServiceClient>(USER_SERVICE_NAME)
  }
}
