import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { ClientGrpc } from '@nestjs/microservices'

import { Token, USER_SERVICE_NAME, UserServiceClient } from 'proto'
import { lastValueFrom } from 'rxjs'

import { AuthService } from '@/application/auth.service'
import { InjectionToken } from '@/application/injection-token'

import { RegisterCommand } from './register.command'

@CommandHandler(RegisterCommand)
export class RegisterCommandHandler implements ICommandHandler<RegisterCommand, Token> {
  private userClient: UserServiceClient

  constructor(
    @Inject(USER_SERVICE_NAME) private readonly client: ClientGrpc,
    @Inject(InjectionToken.AUTH_SERVICE) private readonly authService: AuthService,
  ) {}

  async execute(command: RegisterCommand): Promise<any> {
    try {
      const { username, email, password } = command

      const userRequest = this.userClient.createUser({ username, email, password })
      const user = await lastValueFrom(userRequest)

      if (!user.id) {
        return
      }

      return await this.authService.generateToken(user.id, user.username)
    } catch (error) {
      throw error
    }
  }

  onModuleInit(): void {
    this.userClient = this.client.getService<UserServiceClient>(USER_SERVICE_NAME)
  }
}
