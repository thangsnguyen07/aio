import { Command, CommandProps } from '@libs/core'

export class VerifyTokenCommand extends Command {
  readonly token: string

  constructor(props: CommandProps<VerifyTokenCommand>) {
    super(props)

    this.token = props.token
  }
}
