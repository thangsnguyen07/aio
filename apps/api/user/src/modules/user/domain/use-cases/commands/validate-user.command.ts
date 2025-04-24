import { Command, CommandProps } from 'core'

export class ValidateUserCommand extends Command {
  readonly email: string
  readonly password: string

  constructor(props: CommandProps<ValidateUserCommand>) {
    super(props)

    this.email = props.email
    this.password = props.password
  }
}
