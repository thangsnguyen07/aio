import { Inject, Injectable } from '@nestjs/common'
import { ClientGrpc, ClientKafka, RpcException } from '@nestjs/microservices'

import { USER_SERVICE_NAME, UserServiceClient } from '@libs/proto'

import { randomUUID } from 'crypto'
import { catchError, lastValueFrom, throwError } from 'rxjs'

import { CreateUserRequestDTO } from './dtos/create-user-request.dto'
import { FindUserByIdRequestDto } from './dtos/find-user-by-id-request.dto'
import { CreateUserEvent } from './events/create-user.event'

// import { FindUserByIdEvent } from './events/find-user-by-id.event'

class EventPayload<T> {
  public readonly requestId = randomUUID()
  public readonly data: T

  constructor(data: T) {
    this.data = data
  }

  toString() {
    return JSON.stringify({
      requestId: this.requestId,
      data: this.data,
    })
  }
}

@Injectable()
export class UserService {
  private userClient: UserServiceClient
  constructor(@Inject(USER_SERVICE_NAME) private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.userClient = this.client.getService<UserServiceClient>(USER_SERVICE_NAME)
  }

  createUser(payload: CreateUserRequestDTO) {
    return this.userClient
      .createUser(payload)
      .pipe(catchError((error) => throwError(() => new RpcException(error))))
  }

  findUserById(payload: FindUserByIdRequestDto) {
    return this.userClient
      .findOneUser(payload)
      .pipe(catchError((error) => throwError(() => new RpcException(error))))
  }
}
