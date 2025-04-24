import { Inject, Injectable } from '@nestjs/common'
import { ClientGrpc, RpcException } from '@nestjs/microservices'

import { SuccessResponseDto } from 'core'
import { USER_SERVICE_NAME, UserServiceClient } from 'proto'
import { catchError, map, throwError } from 'rxjs'

import { LoginDto } from './dtos/login.dto'
import { RegisterDto } from './dtos/register.dto'
import { JwtUser } from './interfaces/jwt-user.interface'

@Injectable()
export class AuthService {
  private userClient: UserServiceClient
  constructor(@Inject(USER_SERVICE_NAME) private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.userClient = this.client.getService<UserServiceClient>(USER_SERVICE_NAME)
  }

  refresh(user: JwtUser) {
    return this.userClient
      .generateAccessToken({ userId: user.userId })
      .pipe(catchError((error) => throwError(() => new RpcException(error))))
  }

  logout(user: JwtUser) {
    return this.userClient
      .logout({ userId: user.userId })
      .pipe(catchError((error) => throwError(() => new RpcException(error))))
  }

  login(payload: LoginDto) {
    return this.userClient
      .login(payload)
      .pipe(catchError((error) => throwError(() => new RpcException(error))))
  }

  register(payload: RegisterDto) {
    return this.userClient
      .register(payload)
      .pipe(catchError((error) => throwError(() => new RpcException(error))))
  }
}
