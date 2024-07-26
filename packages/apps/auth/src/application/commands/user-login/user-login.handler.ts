import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { JwtService } from '@nestjs/jwt'
import { ClientGrpc, RpcException } from '@nestjs/microservices'

import { SuccessResponseDto } from '@libs/core/shared/presentation/dtos/response.dto'
import { USER_SERVICE_NAME, UserServiceClient } from '@libs/proto'

import { catchError, lastValueFrom, map, throwError } from 'rxjs'

import { UserLoginCommand } from './user-login.command'

@CommandHandler(UserLoginCommand)
export class UserLoginHandler implements ICommandHandler<UserLoginCommand> {
  private userClient: UserServiceClient

  constructor(
    @Inject(USER_SERVICE_NAME) private readonly client: ClientGrpc,
    private readonly jwtService: JwtService,
  ) {}

  async execute(command: UserLoginCommand): Promise<any> {
    try {
      const req = this.userClient
        .validateUser(command)
        .pipe(catchError((error) => throwError(() => new RpcException(error))))

      const result = await lastValueFrom(req)

      const jwtPayload = { email: result.data.email, sub: result.data.id }

      return new SuccessResponseDto({
        accessToken: this.jwtService.sign(jwtPayload),
        refreshToken: '',
      })
    } catch (error) {
      throw error
    }
  }

  onModuleInit() {
    this.userClient = this.client.getService<UserServiceClient>(USER_SERVICE_NAME)
  }
}
