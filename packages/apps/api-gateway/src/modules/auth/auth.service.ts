import { Inject, Injectable } from '@nestjs/common'
import { ClientGrpc, RpcException } from '@nestjs/microservices'

import { AUTH_SERVICE_NAME, AuthServiceClient } from '@libs/proto/types/auth'

import { catchError, throwError } from 'rxjs'

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
      .pipe(catchError((error) => throwError(() => new RpcException(error))))
  }
}
