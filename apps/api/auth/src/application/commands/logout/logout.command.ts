import { Command, CommandProps } from 'core'

export class LogoutCommand extends Command {
  readonly userId: string

  constructor(props: CommandProps<LogoutCommand>) {
    super(props)

    this.userId = props.userId
  }
}
