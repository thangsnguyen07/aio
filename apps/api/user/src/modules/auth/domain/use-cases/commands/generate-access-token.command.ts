import { Command, CommandProps } from 'core'

export class GenerateAccessTokenCommand extends Command {
  readonly userId: string

  constructor(props: CommandProps<GenerateAccessTokenCommand>) {
    super(props)

    this.userId = props.userId
  }
}
