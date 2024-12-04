import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { UserTokenMapper } from '@/user-token.mapper'
import { Paginated, PaginatedQueryParams } from 'core'
import { Repository } from 'typeorm'

import { UserToken } from '../../domain/user-token.model'
import { UserTokenRepositoryPort } from '../../domain/user-token.repository.port'
import { UserTokenEntity } from '../entities/user-token.entity'

@Injectable()
export class UserTokenRepository implements UserTokenRepositoryPort {
  constructor(
    @InjectRepository(UserTokenEntity) private readonly userRepository: Repository<UserTokenEntity>,
    @Inject() private mapper: UserTokenMapper,
  ) {}

  async findOneByUserId(userId: string): Promise<UserToken | null> {
    const entity = await this.userRepository.findOneBy({ userId })
    return entity ? this.mapper.toDomain(entity) : null
  }

  async findOneByRefreshToken(refreshToken: string): Promise<UserToken | null> {
    const entity = await this.userRepository.findOneBy({ refreshToken })
    return entity ? this.mapper.toDomain(entity) : null
  }

  async findOneById(id: string): Promise<UserToken | null> {
    const entity = await this.userRepository.findOneBy({ id })
    return entity ? this.mapper.toDomain(entity) : null
  }

  async findAll(): Promise<UserToken[]> {
    throw new Error('Method not implemented.')
  }

  async save(model: UserToken | UserToken[]): Promise<void> {
    const models = Array.isArray(model) ? model : [model]

    const entities = models.map((model) => model.getProps())

    await this.userRepository.save(entities)
  }

  async delete(model: UserToken): Promise<boolean> {
    throw new Error(`Method not implemented. ${model}`)
  }

  findAllPaginated(params: PaginatedQueryParams): Promise<Paginated<UserToken>> {
    throw new Error(`Method not implemented. ${params}`)
  }

  transaction<T>(handler: () => Promise<T>): Promise<T> {
    throw new Error(`Method not implemented ${handler}`)
  }
}
