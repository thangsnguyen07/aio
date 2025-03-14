import { Command, CommandProps } from 'core'

export class ValidateUserCommand extends Command {
  readonly username: string
  readonly password: string

  constructor(props: CommandProps<ValidateUserCommand>) {
    super(props)

    this.username = props.username
    this.password = props.password
  }
}
