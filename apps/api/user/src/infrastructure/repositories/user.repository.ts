import { Logger } from '@nestjs/common'

import { Paginated, PaginatedQueryParams, readConnection, writeConnection } from 'core'

import { User } from '../../domain/user.model'
import { UserRepositoryPort } from '../../domain/user.repository.port'
import { UserEntity } from '../entities/user.entity'

export class UserRepository implements UserRepositoryPort {
  private readonly logger: Logger = new Logger(UserRepository.name)

  async findOneById(id: string): Promise<User | null> {
    const entity = await readConnection.getRepository(UserEntity).findOneBy({ id })
    return entity ? User.loadFromEntity(entity) : null
  }

  async findOneByEmail(email: string): Promise<User | null> {
    const entity = await readConnection.getRepository(UserEntity).findOneBy({ email })
    return entity ? User.loadFromEntity(entity) : null
  }

  async findOneByUsername(username: string): Promise<User | null> {
    const entity = await readConnection.getRepository(UserEntity).findOneBy({ username })
    return entity ? User.loadFromEntity(entity) : null
  }

  async findAll(): Promise<User[]> {
    throw new Error('Method not implemented.')
  }

  async save(model: User | User[]): Promise<void> {
    const models = Array.isArray(model) ? model : [model]

    const entities = models.map((model) => model.getProps())

    await writeConnection.manager.getRepository(UserEntity).save(entities)
  }

  delete(model: User): Promise<boolean> {
    throw new Error(`Method not implemented. ${model}`)
  }

  findAllPaginated(params: PaginatedQueryParams): Promise<Paginated<User>> {
    throw new Error(`Method not implemented. ${params}`)
  }

  transaction<T>(handler: () => Promise<T>): Promise<T> {
    throw new Error(`Method not implemented ${handler}`)
  }
}
