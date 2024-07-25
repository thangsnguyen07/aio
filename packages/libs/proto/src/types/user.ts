import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices'

import { Observable } from 'rxjs'

export const userProtobufPackage = 'user'

export interface PaginationDto {
  page: number
  skip: number
  limit: number
}

export interface ResponseDto {
  statusCode: number
  message: string
  data: User | undefined
}

export interface User {
  id: string
  email: string
}

export interface Users {
  users: User[]
}

export interface CreateUserDto {
  email: string
  password: string
}

export interface FindUserByIdDto {
  id: string
}

export interface UpdateUserDto {
  id: string
  password: string
}

export const USER_PACKAGE_NAME = 'user'

export interface UserServiceClient {
  createUser(request: CreateUserDto): Observable<ResponseDto>

  findOneUser(request: FindUserByIdDto): Observable<ResponseDto>

  updateUser(request: UpdateUserDto): Observable<ResponseDto>

  queryUsers(request: Observable<PaginationDto>): Observable<Users>
}

export interface UserServiceController {
  createUser(request: CreateUserDto): Promise<ResponseDto> | Observable<ResponseDto> | ResponseDto

  findOneUser(
    request: FindUserByIdDto,
  ): Promise<ResponseDto> | Observable<ResponseDto> | ResponseDto

  updateUser(request: UpdateUserDto): Promise<ResponseDto> | Observable<ResponseDto> | ResponseDto

  queryUsers(request: Observable<PaginationDto>): Observable<Users>
}

export function UserServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ['createUser', 'findOneUser', 'updateUser']
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method)
      GrpcMethod('UserService', method)(constructor.prototype[method], method, descriptor)
    }
    const grpcStreamMethods: string[] = ['queryUsers']
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method)
      GrpcStreamMethod('UserService', method)(constructor.prototype[method], method, descriptor)
    }
  }
}

export const USER_SERVICE_NAME = 'UserService'
