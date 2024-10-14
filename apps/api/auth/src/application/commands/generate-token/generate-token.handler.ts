import { ConfigService } from '@nestjs/config'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { JwtService } from '@nestjs/jwt'

import { GenerateTokenCommand } from './generate-token.command'

@CommandHandler(GenerateTokenCommand)
export class GenerateTokenHandler implements ICommandHandler<GenerateTokenCommand> {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(command: GenerateTokenCommand): Promise<any> {
    try {
      const { userId, username } = command

      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(
          { sub: userId, username },
          {
            secret: this.configService.get('JWT_ACCESS_SECRET'),
            expiresIn: '1d',
          },
        ),
        this.jwtService.signAsync(
          { sub: userId, username },
          {
            secret: this.configService.get('JWT_REFRESH_SECRET'),
            expiresIn: '7d',
          },
        ),
      ])

      return {
        accessToken,
        refreshToken,
      }
    } catch (error) {
      throw error
    }
  }
}
