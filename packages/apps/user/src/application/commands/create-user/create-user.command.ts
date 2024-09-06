import { Command, CommandProps } from '@libs/core'

export class CreateUserCommand extends Command {
  readonly username: string
  readonly password: string

  constructor(props: CommandProps<CreateUserCommand>) {
    super(props)

    this.username = props.username
    this.password = props.password
  }
}
