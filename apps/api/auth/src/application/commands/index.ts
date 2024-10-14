import { GenerateTokenHandler } from './generate-token/generate-token.handler'
import { LoginCommandHandler } from './login/login.handler'
import { RegisterCommandHandler } from './register/register.handler'
import { VerifyTokenHandler } from './verify-token/verify-token.handler'

export const commandHandlers = [
  GenerateTokenHandler,
  VerifyTokenHandler,
  LoginCommandHandler,
  RegisterCommandHandler,
]
