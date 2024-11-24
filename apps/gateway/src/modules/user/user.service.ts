import { Inject, Injectable } from '@nestjs/common'
import { ClientGrpc, RpcException } from '@nestjs/microservices'

import { SuccessResponseDto } from 'core'
import { USER_SERVICE_NAME, UserServiceClient } from 'proto'
import { catchError, map, throwError } from 'rxjs'

import { JwtUser } from '../auth/interfaces/jwt-user.interface'

@Injectable()
export class UserService {
  private userClient: UserServiceClient
  constructor(@Inject(USER_SERVICE_NAME) private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.userClient = this.client.getService<UserServiceClient>(USER_SERVICE_NAME)
  }

  getUser(user: JwtUser) {
    return this.userClient
      .getUserById({ id: user.sub })
      .pipe(map((res) => new SuccessResponseDto(res, 200)))
      .pipe(catchError((error) => throwError(() => new RpcException(error))))
  }
}
