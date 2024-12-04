import { Inject, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common'

import {
  DataSource,
  DataSourceOptions,
  EntityManager,
  EntityTarget,
  ObjectLiteral,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
} from 'typeorm'

interface WriteConnection {
  readonly startTransaction: (
    level?: 'READ UNCOMMITTED' | 'READ COMMITTED' | 'REPEATABLE READ' | 'SERIALIZABLE',
  ) => Promise<void>
  readonly commitTransaction: () => Promise<void>
  readonly rollbackTransaction: () => Promise<void>
  readonly isTransactionActive: boolean
  readonly manager: EntityManager
}

interface ReadConnection {
  readonly getRepository: <T extends ObjectLiteral>(target: EntityTarget<T>) => Repository<T>
  readonly query: (query: string) => Promise<void>
  readonly createQueryBuilder: <Entity extends ObjectLiteral>(
    entityClass: EntityTarget<Entity>,
    alias: string,
    queryRunner?: QueryRunner,
  ) => SelectQueryBuilder<Entity>
}

export let writeConnection = {} as WriteConnection
export let readConnection = {} as ReadConnection

export class TypeORMDatabaseProvider implements OnModuleInit, OnModuleDestroy {
  constructor(@Inject('TYPEORM_DATASOURCE_OPTIONS') private dataSourceOptions: DataSourceOptions) {}
  private readonly logger: Logger = new Logger(TypeORMDatabaseProvider.name)

  private readonly dataSource = new DataSource(this.dataSourceOptions)

  async onModuleInit(): Promise<void> {
    try {
      await this.dataSource.initialize()
      if (!this.dataSource.isInitialized) throw new Error('DataSource is not initialized')

      this.logger.log('Connected to database!')

      writeConnection = this.dataSource.createQueryRunner()
      readConnection = this.dataSource.manager
    } catch (error) {
      console.error('Error while connecting to database', error)
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.dataSource.destroy()
  }
}
