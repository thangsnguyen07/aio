import { Inject } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { RpcException } from '@nestjs/microservices'

import { User as GetUserByIdResponse } from '@libs/proto'

import { status } from '@grpc/grpc-js'
import { UserRepositoryPort } from 'apps/user/src/domain/user.repository.port'

import { InjectionToken } from '../../injection-token'
import { GetUserByIdQuery } from './get-user-by-id.query'

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdQueryHandler
  implements IQueryHandler<GetUserByIdQuery, GetUserByIdResponse>
{
  constructor(
    @Inject(InjectionToken.USER_REPOSITORY) private readonly repository: UserRepositoryPort,
  ) {}
  async execute(query: GetUserByIdQuery) {
    const { id } = query

    const user = await this.repository.findOneById(id)

    if (!user) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: 'User not found',
      })
    }

    return {
      id: user.id,
      username: user.getProps().username,
      email: user.getProps().email,
    }
  }
}
