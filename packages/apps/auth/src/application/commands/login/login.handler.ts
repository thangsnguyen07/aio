import { Inject } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { JwtService } from '@nestjs/jwt'
import { ClientGrpc } from '@nestjs/microservices'

import { ErrorResponseDto } from '@libs/core/shared/presentation/dtos/response.dto'
import { Token } from '@libs/proto/types/auth'
import { USER_SERVICE_NAME, UserServiceClient } from '@libs/proto/types/user'

import { lastValueFrom } from 'rxjs'

import { LoginCommand } from './login.command'

@CommandHandler(LoginCommand)
export class LoginCommandHandler implements ICommandHandler<LoginCommand, Token> {
  private userClient: UserServiceClient

  constructor(
    @Inject(USER_SERVICE_NAME) private readonly client: ClientGrpc,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(command: LoginCommand) {
    try {
      const { username, password } = command

      const userRequest = this.userClient.validateUser({ username, password })
      const user = await lastValueFrom(userRequest)

      if (!user.id) {
        return
      }

      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(
          { sub: user.id, username },
          {
            secret: this.configService.get('JWT_ACCESS_SECRET'),
            expiresIn: '1d',
          },
        ),
        this.jwtService.signAsync(
          { sub: user.id, username },
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
    } catch (error) {
      throw error
    }
  }

  onModuleInit() {
    this.userClient = this.client.getService<UserServiceClient>(USER_SERVICE_NAME)
  }
}
