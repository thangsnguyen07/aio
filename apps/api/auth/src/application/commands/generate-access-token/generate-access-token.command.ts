import { Command, CommandProps } from 'core'

export class GenerateAccessTokenCommand extends Command {
  readonly refreshToken: string

  constructor(props: CommandProps<GenerateAccessTokenCommand>) {
    super(props)

    this.refreshToken = props.refreshToken
  }
}
