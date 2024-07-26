import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices'

import { Observable } from 'rxjs'

export const authProtobufPackage = 'auth'

export interface ResponseDto {
  statusCode: number
  message: string
  data: UserToken | undefined
  success: boolean
}

export interface UserToken {
  accessToken: string
  refreshToken: string
}

export interface LoginDto {
  email: string
  password: string
}

export interface RegisterDto {
  email: string
  password: string
}

export interface UpdateUserDto {
  id: string
  password: string
}

export const AUTH_PACKAGE_NAME = 'auth'

export interface AuthServiceClient {
  login(request: LoginDto): Observable<ResponseDto>

  register(request: RegisterDto): Observable<ResponseDto>
}

export interface AuthServiceController {
  login(request: LoginDto): Promise<ResponseDto> | Observable<ResponseDto> | ResponseDto

  register(request: RegisterDto): Promise<ResponseDto> | Observable<ResponseDto> | ResponseDto
}

export function AuthServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ['login', 'register']
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method)
      GrpcMethod('AuthService', method)(constructor.prototype[method], method, descriptor)
    }
    const grpcStreamMethods: string[] = []
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method)
      GrpcStreamMethod('AuthService', method)(constructor.prototype[method], method, descriptor)
    }
  }
}

export const AUTH_SERVICE_NAME = 'AuthService'
