import { CreateUserHandler } from './create-user.handler'
import { UpdateUserPasswordHandler } from './update-password.handler'
import { ValidateUserHandler } from './validate-user.handler'

export const commandHandlers = [CreateUserHandler, UpdateUserPasswordHandler, ValidateUserHandler]
