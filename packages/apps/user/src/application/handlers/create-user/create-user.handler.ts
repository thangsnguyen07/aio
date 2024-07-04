import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { CreateUserCommand } from './create-user.command'

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor() {}
  execute(command: CreateUserCommand): Promise<void> {
    return null
  }
}
