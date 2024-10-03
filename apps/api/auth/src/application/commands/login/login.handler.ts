import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { ClientGrpc } from '@nestjs/microservices'

import { Token, USER_SERVICE_NAME, UserServiceClient } from 'proto'
import { lastValueFrom } from 'rxjs'

import { AuthService } from '@/application/auth.service'
import { InjectionToken } from '@/application/injection-token'

import { LoginCommand } from './login.command'

@CommandHandler(LoginCommand)
export class LoginCommandHandler implements ICommandHandler<LoginCommand, Token> {
  private userClient: UserServiceClient

  constructor(
    @Inject(USER_SERVICE_NAME) private readonly client: ClientGrpc,
    @Inject(InjectionToken.AUTH_SERVICE) private readonly authService: AuthService,
  ) {}

  async execute(command: LoginCommand): Promise<any> {
    try {
      const { username, password } = command

      const userRequest = this.userClient.validateUser({ username, password })
      const user = await lastValueFrom(userRequest)

      if (!user.id) {
        return
      }

      return this.authService.generateToken(user.id, username)
    } catch (error) {
      throw error
    }
  }

  onModuleInit(): void {
    this.userClient = this.client.getService<UserServiceClient>(USER_SERVICE_NAME)
  }
}
