import { Command, CommandProps } from 'core'

export class VerifyTokenCommand extends Command {
  readonly token: string

  constructor(props: CommandProps<VerifyTokenCommand>) {
    super(props)

    this.token = props.token
  }
}
