import { Inject, Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'

import { UserLoginDomainEvent } from '@/domain/events/user-login.event'
import { UserTokenRepositoryPort } from '@/domain/user-token.repository.port'

import { InjectionToken } from '../injection-token'

@Injectable()
export class UpdateUserTokenWhenUserIsLoggedInDomainEventHandler {
  constructor(
    @Inject(InjectionToken.USER_TOKEN_REPOSITORY)
    private readonly userTokenRepository: UserTokenRepositoryPort,
  ) {}

  @OnEvent(UserLoginDomainEvent.eventName, { async: true, promisify: true })
  async handle(event: UserLoginDomainEvent): Promise<void> {
    const userToken = await this.userTokenRepository.findOneByUserId(event.userId)

    if (userToken) {
      userToken.update({ refreshToken: event.refreshToken })
      this.userTokenRepository.save(userToken)
    }
  }
}
