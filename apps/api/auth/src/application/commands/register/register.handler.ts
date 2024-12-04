import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { ClientGrpc } from '@nestjs/microservices'

import { Token, USER_SERVICE_NAME, UserServiceClient } from 'proto'
import { lastValueFrom } from 'rxjs'

import { UserRegisterDomainEvent } from '@/domain/events/user-register.event'

import { AuthService } from '@/application/auth.service'
import { InjectionToken } from '@/application/injection-token'

import { RegisterCommand } from './register.command'

@CommandHandler(RegisterCommand)
export class RegisterCommandHandler implements ICommandHandler<RegisterCommand, Token> {
  private userClient: UserServiceClient

  constructor(
    @Inject(USER_SERVICE_NAME) private readonly client: ClientGrpc,
    @Inject(InjectionToken.AUTH_SERVICE) private readonly authService: AuthService,
    private eventEmitter: EventEmitter2,
  ) {}

  async execute(command: RegisterCommand): Promise<any> {
    try {
      const { username, email, password } = command

      const userRequest = this.userClient.createUser({ username, email, password })
      const user = await lastValueFrom(userRequest)

      if (!user.id) {
        return
      }

      const token = await this.authService.generateToken(user.id)

      this.eventEmitter.emit(
        UserRegisterDomainEvent.eventName,
        new UserRegisterDomainEvent({
          userId: user.id,
          refreshToken: token.refreshToken,
        }),
      )

      return token
    } catch (error) {
      throw error
    }
  }

  onModuleInit(): void {
    this.userClient = this.client.getService<UserServiceClient>(USER_SERVICE_NAME)
  }
}
