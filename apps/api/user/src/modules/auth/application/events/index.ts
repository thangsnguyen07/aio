import { CreateUserTokenWhenUserIsRegisteredEventHandler } from './create-user-token-when-user-is-registered.event-handler'
import { UpdateUserTokenWhenUserIsLoggedInDomainEventHandler } from './update-user-token-when-user-is-logged-in.event-handler'

export const eventHandlers = [
  UpdateUserTokenWhenUserIsLoggedInDomainEventHandler,
  CreateUserTokenWhenUserIsRegisteredEventHandler,
]
