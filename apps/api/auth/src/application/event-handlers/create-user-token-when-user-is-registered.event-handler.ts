import { Inject, Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'

import { UserRegisterDomainEvent } from '@/domain/events/user-register.event'
import { UserToken } from '@/domain/user-token.model'
import { UserTokenRepositoryPort } from '@/domain/user-token.repository.port'

import { InjectionToken } from '../injection-token'

@Injectable()
export class CreateUserTokenWhenUserIsRegisteredDomainEventHandler {
  constructor(
    @Inject(InjectionToken.USER_TOKEN_REPOSITORY)
    private readonly userTokenRepository: UserTokenRepositoryPort,
  ) {}

  @OnEvent(UserRegisterDomainEvent.eventName, { async: true, promisify: true })
  async handle(event: UserRegisterDomainEvent): Promise<void> {
    const userToken = UserToken.create({ userId: event.userId, refreshToken: event.refreshToken })
    return this.userTokenRepository.save(userToken)
  }
}
