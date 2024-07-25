import { Command, CommandProps } from '@libs/core'

export class CreateUserCommand extends Command {
  readonly email: string
  readonly password: string

  constructor(props: CommandProps<CreateUserCommand>) {
    super(props)

    this.email = props.email
    this.password = props.password
  }
}
