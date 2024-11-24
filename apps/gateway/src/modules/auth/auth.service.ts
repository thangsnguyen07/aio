import { Inject, Injectable } from '@nestjs/common'
import { ClientGrpc, RpcException } from '@nestjs/microservices'

import { SuccessResponseDto } from 'core'
import { AUTH_SERVICE_NAME, AuthServiceClient } from 'proto'
import { catchError, map, throwError } from 'rxjs'

import { LoginDto } from './dtos/login.dto'
import { RegisterDto } from './dtos/register.dto'
import { JwtUser } from './interfaces/jwt-user.interface'

@Injectable()
export class AuthService {
  private authClient: AuthServiceClient
  constructor(@Inject(AUTH_SERVICE_NAME) private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.authClient = this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME)
  }

  refresh(user: JwtUser) {
    return this.authClient
      .generateAccessToken({ userId: user.sub })
      .pipe(map((res) => new SuccessResponseDto(res, 200)))
      .pipe(catchError((error) => throwError(() => new RpcException(error))))
  }

  logout(user: JwtUser) {
    return this.authClient
      .logout({ userId: user.sub })
      .pipe(catchError((error) => throwError(() => new RpcException(error))))
  }

  login(payload: LoginDto) {
    return this.authClient
      .login(payload)
      .pipe(map((res) => new SuccessResponseDto(res, 200)))
      .pipe(catchError((error) => throwError(() => new RpcException(error))))
  }

  register(payload: RegisterDto) {
    return this.authClient
      .register(payload)
      .pipe(map((res) => new SuccessResponseDto(res, 200)))
      .pipe(catchError((error) => throwError(() => new RpcException(error))))
  }
}
