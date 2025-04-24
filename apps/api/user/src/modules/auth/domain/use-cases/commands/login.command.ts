import { Command, CommandProps } from 'core'

export class LoginCommand extends Command {
  readonly email: string
  readonly password: string

  constructor(props: CommandProps<LoginCommand>) {
    super(props)

    this.email = props.email
    this.password = props.password
  }
}
