import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Paginated, PaginatedQueryParams } from 'core'
import { Repository } from 'typeorm'

import { User } from '../../domain/user.model'
import { UserRepositoryPort } from '../../domain/user.repository.port'
import { UserEntity } from '../entities/user.entity'

@Injectable()
export class UserRepository implements UserRepositoryPort {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findOneById(id: string): Promise<User | null> {
    const entity = await this.userRepository.findOneBy({ id })
    return entity ? User.loadFromEntity(entity) : null
  }

  async findOneByEmail(email: string): Promise<User | null> {
    const entity = await this.userRepository.findOneBy({ email })
    return entity ? User.loadFromEntity(entity) : null
  }

  async findOneByUsername(username: string): Promise<User | null> {
    const entity = await this.userRepository.findOneBy({ username })
    return entity ? User.loadFromEntity(entity) : null
  }

  async findAll(): Promise<User[]> {
    throw new Error('Method not implemented.')
  }

  async save(model: User | User[]): Promise<void> {
    const models = Array.isArray(model) ? model : [model]

    const entities = models.map((model) => model.getProps())

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
