import { CreateUserHandler } from './create-user/create-user.handler'
import { ValidateUserHandler } from './validate-user/validate-user.handler'

export const commandHandlers = [CreateUserHandler, ValidateUserHandler]
