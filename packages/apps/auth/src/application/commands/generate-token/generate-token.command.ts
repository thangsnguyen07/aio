import { Command, CommandProps } from '@libs/core'

export class GenerateTokenCommand extends Command {
  readonly userId: string
  readonly username: string

  constructor(props: CommandProps<GenerateTokenCommand>) {
    super(props)

    this.userId = props.userId
    this.username = props.username
  }
}
