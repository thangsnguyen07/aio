import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { ClientGrpc, RpcException } from '@nestjs/microservices'

import { AUTH_SERVICE_NAME, AuthServiceClient } from '@libs/proto/types/auth'

import { status } from '@grpc/grpc-js'
import { UserToken } from 'apps/user/src/domain/user-token.model'
import { UserTokenRepositoryPort } from 'apps/user/src/domain/user-token.repository.port'
import { User } from 'apps/user/src/domain/user.model'
import { UserRepositoryPort } from 'apps/user/src/domain/user.repository.port'
import * as bcrypt from 'bcrypt'
import { catchError, lastValueFrom, throwError } from 'rxjs'

import { InjectionToken } from '../../injection-token'
import { CreateUserCommand } from './create-user.command'

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  private authClient: AuthServiceClient

  constructor(
    @Inject(AUTH_SERVICE_NAME) private readonly client: ClientGrpc,
    @Inject(InjectionToken.USER_REPOSITORY) private readonly repository: UserRepositoryPort,
    @Inject(InjectionToken.USER_TOKEN_REPOSITORY)
    private readonly tokenRepository: UserTokenRepositoryPort,
  ) {}
  async execute(command: CreateUserCommand): Promise<any> {
    const { username, password } = command

    const isUserExist = await this.repository.findOneByUsername(username)

    if (isUserExist) {
      throw new RpcException({
        code: status.ALREADY_EXISTS,
        message: 'User with this username already exists',
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = User.create({ username, password: hashedPassword })
    await this.repository.save(user)

    const tokenRequest = this.authClient
      .generateToken({ userId: user.id, username })
      .pipe(catchError((error) => throwError(() => new RpcException(error))))

    const token = await lastValueFrom(tokenRequest)

    const userToken = UserToken.create({ userId: user.id, refreshToken: token.refreshToken })
    await this.tokenRepository.save(userToken)

    return {
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
    }
  }

  onModuleInit() {
    this.authClient = this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME)
  }
}
