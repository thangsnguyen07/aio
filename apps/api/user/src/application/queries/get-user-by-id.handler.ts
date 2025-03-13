import { Inject } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { RpcException } from '@nestjs/microservices'

import { status } from '@grpc/grpc-js'
import { User as GetUserByIdResponse } from 'proto'

import { GetUserByIdQuery } from '@/domain/use-cases/queries/get-user-by-id.query'
import { UserRepositoryPort } from '@/domain/user.repository.port'

import { InjectionToken } from '../injection-token'

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdQueryHandler
  implements IQueryHandler<GetUserByIdQuery, GetUserByIdResponse>
{
  constructor(
    @Inject(InjectionToken.USER_REPOSITORY) private readonly repository: UserRepositoryPort,
  ) {}
  async execute(query: GetUserByIdQuery): Promise<GetUserByIdResponse> {
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
