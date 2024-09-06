import { Paginated, PaginatedQueryParams, readConnection, writeConnection } from '@libs/core'

import { UserToken } from '../../domain/user-token.model'
import { UserTokenRepositoryPort } from '../../domain/user-token.repository.port'
import { UserTokenEntity } from '../entities/user-token.entity'

export class UserTokenRepository implements UserTokenRepositoryPort {
  async findOneById(id: string): Promise<UserToken | null> {
    const entity = await readConnection.getRepository(UserTokenEntity).findOneBy({ id })
    return entity ? UserToken.loadFromEntity(entity) : null
  }

  async findAll(): Promise<UserToken[]> {
    throw new Error('Method not implemented.')
  }

  async save(model: UserToken | UserToken[]): Promise<void> {
    const models = Array.isArray(model) ? model : [model]

    const entities = models.map((model) => model.getProps())

    await writeConnection.manager.getRepository(UserTokenEntity).save(entities)
  }

  delete(model: UserToken): Promise<boolean> {
    throw new Error(`Method not implemented. ${model}`)
  }

  findAllPaginated(params: PaginatedQueryParams): Promise<Paginated<UserToken>> {
    throw new Error(`Method not implemented. ${params}`)
  }

  transaction<T>(handler: () => Promise<T>): Promise<T> {
    throw new Error(`Method not implemented ${handler}`)
  }
}
