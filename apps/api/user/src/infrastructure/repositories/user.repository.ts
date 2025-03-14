import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Paginated, PaginatedQueryParams } from 'core'
import { Repository } from 'typeorm'

import { InjectionToken } from '@/application/injection-token'

import { User } from '../../domain/user.model'
import { UserRepositoryPort } from '../../domain/user.repository.port'
import { UserEntity } from '../entities/user.entity'
import { UserMapper } from '../mappers/user.mapper'

@Injectable()
export class UserRepository implements UserRepositoryPort {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    @Inject(InjectionToken.USER_MAPPER) private readonly userMapper: UserMapper,
  ) {}

  async findOneById(id: string): Promise<User | null> {
    const entity = await this.userRepository.findOneBy({ id })
    return entity ? this.userMapper.toDomain(entity) : null
  }

  async findOneByEmail(email: string): Promise<User | null> {
    const entity = await this.userRepository.findOneBy({ email })
    return entity ? this.userMapper.toDomain(entity) : null
  }

  async findOneByUsername(username: string): Promise<User | null> {
    const entity = await this.userRepository.findOneBy({ username })
    return entity ? this.userMapper.toDomain(entity) : null
  }

  async findAll(): Promise<User[]> {
    throw new Error('Method not implemented.')
  }

  async save(model: User | User[]): Promise<void> {
    const models = Array.isArray(model) ? model : [model]

    const entities = models.map((model) => this.userMapper.toPersistence(model))

    await this.userRepository.save(entities)
  }

  async delete(model: User): Promise<boolean> {
    const result = await this.userRepository.softDelete(model)
    return !!result
  }

  findAllPaginated(params: PaginatedQueryParams): Promise<Paginated<User>> {
    throw new Error(`Method not implemented. ${params}`)
  }

  transaction<T>(handler: () => Promise<T>): Promise<T> {
    throw new Error(`Method not implemented ${handler}`)
  }
}
