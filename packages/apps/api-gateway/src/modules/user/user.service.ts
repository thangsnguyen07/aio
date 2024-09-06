import { Inject, Injectable } from '@nestjs/common'
import { ClientGrpc, RpcException } from '@nestjs/microservices'

import { SuccessResponseDto } from '@libs/core/shared/presentation/dtos/response.dto'
import { USER_SERVICE_NAME, UserServiceClient } from '@libs/proto/types/user'

import { catchError, map, throwError } from 'rxjs'

import { GetUserByIdRequestDto } from './dtos/get-user-by-id-request.dto'

@Injectable()
export class UserService {
  private userClient: UserServiceClient
  constructor(@Inject(USER_SERVICE_NAME) private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.userClient = this.client.getService<UserServiceClient>(USER_SERVICE_NAME)
  }

  getUserById(payload: GetUserByIdRequestDto) {
    return this.userClient
      .getUserById(payload)
      .pipe(map((res) => new SuccessResponseDto(res, 200, 'User retrieved successfully')))
      .pipe(catchError((error) => throwError(() => new RpcException(error))))
  }
}
