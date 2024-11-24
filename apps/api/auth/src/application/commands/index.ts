import { GenerateAccessTokenHandler } from './generate-access-token/generate-access-token.handler'
import { LoginCommandHandler } from './login/login.handler'
import { RegisterCommandHandler } from './register/register.handler'
import { VerifyTokenHandler } from './verify-token/verify-token.handler'

export const commandHandlers = [
  GenerateAccessTokenHandler,
  VerifyTokenHandler,
  LoginCommandHandler,
  RegisterCommandHandler,
]
