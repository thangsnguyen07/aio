import { Inject, Injectable, Logger } from '@nestjs/common'
import { ClientGrpc, RpcException } from '@nestjs/microservices'

import { USER_SERVICE_NAME, UserServiceClient } from '@libs/proto'

import { catchError, lastValueFrom, throwError } from 'rxjs'

@Injectable()
export class AuthService {
  private userClient: UserServiceClient

  constructor(@Inject(USER_SERVICE_NAME) private readonly client: ClientGrpc) {}

  async validateUser(email: string, password: string) {
    try {
      const req = this.userClient
        .validateUser({ email, password })
        .pipe(catchError((error) => throwError(() => new RpcException(error))))

      const result = await lastValueFrom(req)

      return result
    } catch (error) {
      Logger.log(error)
      throw error
    }
  }

  onModuleInit() {
    this.userClient = this.client.getService<UserServiceClient>(USER_SERVICE_NAME)
  }
}
