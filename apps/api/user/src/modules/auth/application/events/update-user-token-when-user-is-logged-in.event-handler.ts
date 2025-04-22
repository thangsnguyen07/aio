import { Inject, Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'

import { UserLoggedInEvent } from '../../domain/use-cases/events/user-logged-in.event'
import { UserTokenRepositoryPort } from '../../domain/user-token.repository.port'
import { InjectionToken } from '../injection-token'

@Injectable()
export class UpdateUserTokenWhenUserIsLoggedInDomainEventHandler {
  constructor(
    @Inject(InjectionToken.USER_TOKEN_REPOSITORY)
    private readonly userTokenRepository: UserTokenRepositoryPort,
  ) {}

  @OnEvent(UserLoggedInEvent.eventName, { async: true, promisify: true })
  async handle(event: UserLoggedInEvent): Promise<void> {
    const userToken = await this.userTokenRepository.findOneByUserId(event.userId)

    if (userToken) {
      userToken.update({ refreshToken: event.refreshToken, revokedAt: null })
      this.userTokenRepository.save(userToken)
    }
  }
}
