import { GenerateAccessTokenHandler } from './generate-access-token/generate-access-token.handler'
import { LoginCommandHandler } from './login/login.handler'
import { LogoutCommandHandler } from './logout/logout.handler'
import { RegisterCommandHandler } from './register/register.handler'

export const commandHandlers = [
  GenerateAccessTokenHandler,
  LoginCommandHandler,
  RegisterCommandHandler,
  LogoutCommandHandler,
]
