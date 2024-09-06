import { Inject, Injectable } from '@nestjs/common'
import { ClientGrpc, RpcException } from '@nestjs/microservices'

import { SuccessResponseDto } from '@libs/core/shared/presentation/dtos/response.dto'
import { AUTH_SERVICE_NAME, AuthServiceClient } from '@libs/proto/types/auth'

import { catchError, map, throwError } from 'rxjs'

import { CreateUserRequestDTO } from './dtos/create-user-request.dto'

@Injectable()
export class AuthService {
  private authClient: AuthServiceClient
  constructor(@Inject(AUTH_SERVICE_NAME) private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.authClient = this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME)
  }

  login(payload: CreateUserRequestDTO) {
    return this.authClient
      .login(payload)
      .pipe(map((res) => new SuccessResponseDto(res, 200, 'User logged in successfully')))
      .pipe(catchError((error) => throwError(() => new RpcException(error))))
  }
}
