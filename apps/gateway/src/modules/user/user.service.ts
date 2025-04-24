import { Inject, Injectable } from '@nestjs/common'
import { ClientGrpc, RpcException } from '@nestjs/microservices'

import { GrpcClientService } from '@/common/services/grpc-client.service'
import { USER_SERVICE_NAME, UserServiceClient } from 'proto'
import { catchError, throwError } from 'rxjs'

import { JwtUser } from '../auth/interfaces/jwt-user.interface'
import { UpdatePasswordDto } from './dtos/update-password.dto copy'
import { UpdateUserDto } from './dtos/update-user.dto'

@Injectable()
export class UserService {
  private userClient: UserServiceClient

  constructor(
    @Inject(USER_SERVICE_NAME) private readonly client: ClientGrpc,
    private readonly grpcClientService: GrpcClientService,
  ) {
    this.userClient = this.grpcClientService.getClient(this.client, USER_SERVICE_NAME)
  }

  getUser(user: JwtUser) {
    return this.userClient
      .getUserById({ id: user.userId })
      .pipe(catchError((error) => throwError(() => new RpcException(error))))
  }

  updateUser(user: JwtUser, payload: UpdateUserDto) {
    return this.userClient
      .updateUser({ userId: user.userId, ...payload })
      .pipe(catchError((error) => throwError(() => new RpcException(error))))
  }

  updatePassword(user: JwtUser, payload: UpdatePasswordDto) {
    return this.userClient
      .updateUserPassword({ userId: user.userId, ...payload })
      .pipe(catchError((error) => throwError(() => new RpcException(error))))
  }
}
