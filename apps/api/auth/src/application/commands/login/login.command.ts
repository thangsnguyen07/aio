import { Command, CommandProps } from 'core'

export class LoginCommand extends Command {
  readonly username: string
  readonly password: string

  constructor(props: CommandProps<LoginCommand>) {
    super(props)

    this.username = props.username
    this.password = props.password
  }
}
