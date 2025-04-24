import { Command, CommandProps } from 'core'

export class RegisterCommand extends Command {
  readonly email: string
  readonly password: string

  constructor(props: CommandProps<RegisterCommand>) {
    super(props)

    this.email = props.email
    this.password = props.password
  }
}
