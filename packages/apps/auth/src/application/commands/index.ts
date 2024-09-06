import { GenerateTokenHandler } from './generate-token/generate-token.handler'
import { VerifyTokenHandler } from './verify-token/verify-token.handler'

export const commandHandlers = [GenerateTokenHandler, VerifyTokenHandler]
